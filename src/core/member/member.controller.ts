import { Controller, Delete, Get, Post } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  createMember() {
    return this.memberService.create();
  }

  @Get()
  getMembers() {
    return this.memberService.getByFilter();
  }

  @Get(':id')
  getMember() {
    return this.memberService.getOne();
  }

  @Delete(':id')
  deleteMember() {
    return this.memberService.delete();
  }
}
