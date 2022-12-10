import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

describe('FriendController', () => {
  let friendController: FriendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FriendController, FriendService]
    }).compile();

    friendController = app.get<FriendController>(FriendController);
  });

  describe('root', () => {
    it('should return "Hello Friend!"', () => {
      expect(friendController.getFriend()).toBe('Hello Friend!');
    });
  });
});
