import { Test, TestingModule } from '@nestjs/testing';
import { MinistryController } from './ministry.controller';
import { MinistryService } from './ministry.service';

describe('MinistryController', () => {
  let accountController: MinistryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [MinistryController, MinistryService]
    }).compile();

    accountController = app.get<MinistryController>(MinistryController);
  });

  describe('root', () => {
    it('should return "Hello Ministry!"', () => {
      expect(accountController.getMinistry()).toBe('Hello Ministry!');
    });
  });
});
