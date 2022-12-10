import { Test, TestingModule } from '@nestjs/testing';
import { CareController } from './care.controller';
import { CareService } from './care.service';

describe('CareController', () => {
  let careController: CareController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CareController, CareService]
    }).compile();

    careController = app.get<CareController>(CareController);
  });

  describe('root', () => {
    it('should return "Hello Care!"', () => {
      expect(careController.getCare()).toBe('Hello Care!');
    });
  });
});
