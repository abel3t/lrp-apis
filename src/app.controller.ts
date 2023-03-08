import { Controller, Header, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { S3Service } from './shared/services/s3.service';
import {
  CurrentAccount,
  ICurrentAccount
} from './decorators/account.decorator';

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

    const result = await this.s3Service.uploadFile(
      account.id,
      data.file,
      data.filename
    );

    return res.send({
      link: result
    });
  }
}
