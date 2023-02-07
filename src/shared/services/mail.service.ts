import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppConfig } from '../config';

interface IBirthdayEmailDto {
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendBirthdayEmail({ subject, html }: IBirthdayEmailDto) {
    this.mailerService
      .sendMail({
        to: AppConfig.MAIL.BIRTHDAY_RECEIVER_EMAIL,
        from: AppConfig.MAIL.FROM_EMAIL,
        subject,
        html
      })
      .then(() =>
        Logger.log(`Send remind birthday email successfully!`, 'MailService')
      )
      .catch((error) => {
        Logger.error(
          `Send remind birthday email failed!`,
          error,
          'MailService'
        );
      });
  }
}
