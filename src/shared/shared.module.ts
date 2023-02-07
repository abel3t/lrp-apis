import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.service';
import { CognitoService } from './services/cognito.service';
import { CronJobService } from './services/cron-job.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailService } from './services/mail.service';
import { AppConfig } from './config';

@Global()
@Module({
  providers: [CognitoService, PrismaService, CronJobService, MailService],
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${AppConfig.MAIL.FROM_EMAIL}:${AppConfig.MAIL.APP_PASS}@smtp.gmail.com`,
        defaults: {
          from: `"LEC Q10 Reminder" <${AppConfig.MAIL.FROM_EMAIL}>`
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true
          }
        }
      })
    })
  ],
  exports: [CognitoService, PrismaService, MailService, CronJobService]
})
export class SharedModule {}
