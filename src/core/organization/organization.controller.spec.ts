import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

describe('OrganizationController', () => {
  let organizationController: OrganizationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [OrganizationController, OrganizationService]
    }).compile();

    organizationController = app.get<OrganizationController>(OrganizationController);
  });

  describe('root', () => {
    it('should return "Hello Organization!"', () => {
      expect(organizationController.getOrganization()).toBe('Hello Organization!');
    });
  });
});
