import { Module } from '@nestjs/common';
import { MinistryController } from './ministry.controller';
import { MinistryService } from './ministry.service';

@Module({
  imports: [],
  controllers: [MinistryController],
  providers: [MinistryService]
})
export class MinistryModule {}
