import { Injectable, Logger } from '@nestjs/common';
import { config as AwsConfig, S3 } from 'aws-sdk';

import { AppConfig } from '../config';

@Injectable()
export class S3Service {
  logger = new Logger('CognitoService');
  public s3Bucket: string;

  constructor() {
    const region = AppConfig.AWS.COGNITO.REGION;
    const accessKeyId = AppConfig.AWS.ACCESS_KEY_ID;
    const secretAccessKey = AppConfig.AWS.SECRET_ACCESS_KEY;
    this.s3Bucket = AppConfig.AWS.S3.BUCKET;

    AwsConfig.update({
      accessKeyId,
      secretAccessKey,
      region
    });
  }

  async uploadFile(file: File, fileName: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.s3Bucket,
        Body: file,
        Key: `${new Date().toISOString()}-${fileName || 'unknown'}`
      })
      .promise();

    return uploadResult.Location;
  }
}
