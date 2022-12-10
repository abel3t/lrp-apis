import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let adminController: AdminController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AdminController, AdminService]
    }).compile();

    adminController = app.get<AdminController>(AdminController);
  });

  describe('root', () => {
    it('should return "Hello Admin!"', () => {
      expect(adminController.getAdmin()).toBe('Hello Admin!');
    });
  });
});
