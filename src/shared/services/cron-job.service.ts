import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';
import { MailService } from './mail.service';
import { VietNamTimezone } from 'contansts/date.contanst';
import { AppConfig } from '../config';
import { formatMonthDay, getBirthday } from '../utils/date.util';

const EVERY_10TH_DAY_OF_MONTH_AT_9AM = '0 09 10 * *';
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
          AND "organizationId" = ${AppConfig.MAIL.ORGANIZATION_ID}
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
          AND "organizationId" = ${AppConfig.MAIL.ORGANIZATION_ID}
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
                 <p>Mình sẽ nhắc bạn đăng bài vào 9:00 sáng mai nhé! 🎂🎁🎉🥳</p>
             </div>
        </div>`
      });
    });

    this.logger.debug('Cronjob started at 9:00 PM', 'reminderTomorrowBirthday');
  }

  @Cron(EVERY_10TH_DAY_OF_MONTH_AT_9AM, { timeZone: VietNamTimezone })
  async reminderQuarterBirthday() {
    const MONTHS_PER_QUARTER = 3;
    const END_DATE_OF_MONTH = 31;
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const endOfQuarterMonths = [3, 6, 9, 12];

    if (!endOfQuarterMonths?.includes(currentMonth)) {
      return;
    }

    let lastQuarterMonth = 0;
    if (currentMonth > MONTHS_PER_QUARTER) {
      lastQuarterMonth = currentMonth - MONTHS_PER_QUARTER;
    }

    const members: any[] = await this.prisma.$queryRaw`
        SELECT * FROM "Member"
        WHERE 
          EXTRACT(DAY FROM "birthday") <= ${END_DATE_OF_MONTH}  
          AND EXTRACT(MONTH FROM "birthday") <= ${currentMonth}
          AND EXTRACT(MONTH FROM "birthday") > ${lastQuarterMonth}
          AND "organizationId" = ${AppConfig.MAIL.ORGANIZATION_ID}
          AND "isDeleted" = false`;

    if (!members.length) {
      this.mailService.sendBirthdayEmail({
        subject: `Quý này không có sinh nhật của ai cả! Hãy nghỉ ngơi nhé!!!!🎉🥳`,
        html: `<div>“Người nào ở nơi kín đáo của Đấng Chí Cao, sẽ được hằng ở dưới bóng của Đấng Toàn năng.” <strong>(Thi Thiên 91)</strong><div/>`
      });
    }

    const birthdayLists = members
      .filter((member) => member.name)
      .map((member) => ({
        name: member.name,
        birthday: member.birthday
      }));

    birthdayLists
      .sort((a, b) => {
        return formatMonthDay(a.birthday) > formatMonthDay(b.birthday) ? 1 : -1;
      });

    this.mailService.sendQuarterBirthday({
      subject: `[LEC Q10]: Sinh nhật quý - hôm nay là ngày chuẩn bị sinh nhật quý rồi đấy! 🎂🎁🎉🥳`,
      html: `<div>
             <p><strong><i>Hi chị Huyền,</i></strong></p>

             <div>
                <p>Hôm nay, em gửi sinh nhật quý đấy!</p>
                <p>Nhớ chuẩn bị quà tặng chúc mừng các bạn ấy nhé! 🎂🎁🎉🥳</p>
                
                <p>Dưới đây là danh sách các bạn có sinh nhật trong quý:</p>
                <ul>
                    ${birthdayLists
                      .map(
                        (member) =>
                          `<li>
                                <span><strong>${member.name}</strong></span>:
                                <span>${getBirthday(member.birthday)}</span>
                        </li>`
                      )
                      .join('')}
                </ul>
             </div>
          </div>`
    });
    this.logger.debug('Cronjob started at 9:00 AM', 'reminderQuarterBirthday');
  }
}
