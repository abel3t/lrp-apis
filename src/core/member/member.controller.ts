import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'core/account/account.enum';
import { CurrentAccount, ICurrentAccount } from 'decorators/account.decorator';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  createMember(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateMemberDto
  ) {
    return this.memberService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  updateMember(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateMemberDto,
    @Param('id') memberId: string
  ) {
    return this.memberService.update(account, memberId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMembers(@CurrentAccount() account: ICurrentAccount) {
    return this.memberService.getByFilter(account);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') memberId: string
  ) {
    return this.memberService.getOne(account, memberId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon)
  deleteMember() {
    return this.memberService.delete();
  }
}
