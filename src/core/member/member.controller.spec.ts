import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

describe('MemberController', () => {
  let memberController: MemberController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [MemberController, MemberService]
    }).compile();

    memberController = app.get<MemberController>(MemberController);
  });

  describe('root', () => {
    it('should return "Hello Member!"', () => {
      expect(memberController.getMember()).toBe('Hello Member!');
    });
  });
});
