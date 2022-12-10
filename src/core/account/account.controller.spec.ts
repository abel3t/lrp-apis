import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AccountController, AccountService]
    }).compile();

    accountController = app.get<AccountController>(AccountController);
  });

  describe('root', () => {
    it('should return "Hello Account!"', () => {
      expect(accountController.getAccount()).toBe('Hello Account!');
    });
  });
});
