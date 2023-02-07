import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';
import { MailService } from './mail.service';
import { VietNamTimezone } from 'contansts/date.contanst';

@Injectable()
export class CronJobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) {}

  private readonly logger = new Logger(CronJobService.name);

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { timeZone: VietNamTimezone })
  async reminderTodayBirthday() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    const members: any[] = await this.prisma.$queryRaw`
        SELECT * FROM "Member"
        WHERE 
          EXTRACT(DAY FROM "birthday") = ${todayDay}  
          AND EXTRACT(MONTH FROM "birthday") = ${todayMonth}
          AND "isDeleted" = false`;

    if (!members.length) {
      this.mailService.sendBirthdayEmail({
        subject: `Hôm nay không có sinh nhật của ai cả! Hãy nghỉ ngơi nhé!!!!🎉🥳`,
        html: `<div>“Người nào ở nơi kín đáo của Đấng Chí Cao, sẽ được hằng ở dưới bóng của Đấng Toàn năng.” <strong>(Thi Thiên 91)</strong><div/>`
      });
    }

    members.forEach((member) => {
      if (!member?.name) {
        return;
      }

      const todayString =
        `${todayDay}`.padStart(2, '0') + '/' + `${todayMonth}`.padStart(2, '0');

      this.mailService.sendBirthdayEmail({
        subject: `Hôm nay (${todayString}) là sinh nhật ${member.name} 🎂🎁🎉🥳`,
        html: `<div>
             <p><strong><i>Hi Thuận,</i></strong></p>

             <div>
                <p>Hôm nay là sinh nhật của <strong>${member.name}</strong> đấy!</p>
                <p>Nhớ đăng bài chúc mừng bạn ấy nhé! 🎂🎁🎉🥳</p>
             </div>
          </div>`
      });
    });

    this.logger.debug('Cronjob started at 9:00 AM', 'reminderTodayBirthday');
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM, { timeZone: VietNamTimezone })
  async reminderTomorrowBirthday() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDay = tomorrow.getDate();
    const tomorrowMonth = tomorrow.getMonth() + 1;

    const members: any[] = await this.prisma.$queryRaw`
        SELECT * FROM "Member"
        WHERE 
          EXTRACT(DAY FROM "birthday") = ${tomorrowDay}  
          AND EXTRACT(MONTH FROM "birthday") = ${tomorrowMonth}
          AND "isDeleted" = false`;

    members.forEach((member) => {
      if (!member?.name) {
        return;
      }

      const tomorrowString =
        `${tomorrowDay}`.padStart(2, '0') +
        '/' +
        `${tomorrowMonth}`.padStart(2, '0');

      this.mailService.sendBirthdayEmail({
        subject: `Ngày mai (${tomorrowString}) là sinh nhật ${member.name} 🎂🎁🎉🥳`,
        html: `<div>
            <p><strong><i>Hi Thuận,</i></strong></p>
             
             <div>
                <p>Ngày mai là sinh nhật của <strong>${member.name}</strong> đấy nhé!</p>
                 <p>Nhớ chuẩn bị hình ảnh và câu Kinh Thánh để chúc mừng nha!</p>
                 <p>Ngày mai mình sẽ nhắc bạn để đăng vào 9:00 sáng nhé! 🎂🎁🎉🥳</p>
             </div>
        </div>`
      });
    });

    this.logger.debug('Cronjob started at 9:00 PM', 'reminderTomorrowBirthday');
  }
}
