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
import { FriendService } from './friend.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../account/account.enum';
import {
  CurrentAccount,
  ICurrentAccount
} from '../../decorators/account.decorator';
import {
  CreateFriendDto,
  GetFriendsDto,
  UpdateFriendDto
} from './dto/friend.dto';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  createFriend(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: CreateFriendDto
  ) {
    return this.friendService.create(account, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  updateFriend(
    @CurrentAccount() account: ICurrentAccount,
    @Body() body: UpdateFriendDto,
    @Param('id') friendId: string
  ) {
    return this.friendService.update(account, friendId, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getFriends(
    @CurrentAccount() account: ICurrentAccount,
    @Query() filter: GetFriendsDto
  ) {
    return this.friendService.getByFilter(account, filter);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  getMember(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') friendId: string
  ) {
    return this.friendService.getOne(account, friendId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Pastor, Role.Staff, Role.Deacon, Role.Missionary)
  deleteFriend(
    @CurrentAccount() account: ICurrentAccount,
    @Param('id') friendId: string
  ) {
    return this.friendService.delete(account, friendId);
  }
}
