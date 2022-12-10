import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller()
export class MemberController {
  constructor(private readonly accountService: MemberService) {}

  @Get('/member')
  getMember(): string {
    return this.accountService.getMember();
  }
}
