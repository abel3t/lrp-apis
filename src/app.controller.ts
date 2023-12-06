import { Controller, Header, Post, Req, Res, UseGuards } from '@nestjs/common';
import { S3Service } from './shared/services/s3.service';
import * as sharp from 'sharp';
import * as heicConvert from 'heic-convert';
import {
  CurrentAccount,
  ICurrentAccount
} from './decorators/account.decorator';
import { AuthGuard } from 'guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly s3Service: S3Service) {}

  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  @Post('uploadFile')
  async upload(
    @Req() req,
    @Res() res,
    @CurrentAccount() account: ICurrentAccount
  ) {
    const data = await req.file();

    const sharpify = async () => {
      try {
        const fileTypePattern = /\.[0-9a-z]+$/i;

        let fileBuffer = await data.fields.file.toBuffer();

        if (
          data.mimetype === 'image/heic' ||
          data.filename.match(fileTypePattern)?.[0]?.toLowerCase() === '.heic'
        ) {
          fileBuffer = await heicConvert({
            buffer: fileBuffer as any,
            format: 'JPEG',
            quality: 1
          });
        }

        const image = sharp(fileBuffer);
        const meta = await image.metadata();
        const { format, size } = meta;

        const RESIZE_BYTE = 7 * 1024 * 1024;

        const quality =
          size <= RESIZE_BYTE ? 100 : Math.round((RESIZE_BYTE / size) * 100);

        const config = {
          jpeg: { quality },
          webp: { quality },
          png: { quality },
          jpg: { quality }
        };

        return image[format](config[format]).resize({
          width: 1000,
          withoutEnlargement: true
        });
      } catch (err) {
        throw new Error(err);
      }
    };

    const file = await sharpify();

    const result = await this.s3Service.uploadFile(account.id, file, data.filename);

    return res.send({
      link: result
    });
  }
}
