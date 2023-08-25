import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'core/account/account.enum';
import { CurrentAccount, ICurrentAccount } from 'decorators/account.decorator';
import { CreateMemberDto, GetMembersDto, UpdateMemberDto } from './dto/member.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  createMember(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateMemberDto
  ) {
    return this.memberService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  updateMember(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateMemberDto,
    @Param('id') memberId: string
  ) {
    return this.memberService.update(account, memberId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getMembers(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: GetMembersDto
  ) {
    return this.memberService.getByFilter(account, filter);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') memberId: string
  ) {
    return this.memberService.getOne(account, memberId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  deleteMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') memberId: string
  ) {
    return this.memberService.delete(account, memberId);
  }

  @Put(':memberId/assignees/:curatorId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  assignMemberToCurator(
    @CurrentAccount() account: ICurrentAccount,
    @Param('memberId') memberId: string,
    @Param('curatorId') curatorId: string
  ) {
    return this.memberService.assignMemberToCurator(account, {
      memberId,
      curatorId
    });
  }

  @Get(':id/friends')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getFriendsOfMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') memberId: string
  ) {
    return this.memberService.getFriendsOfMember(account, memberId);
  }
}
