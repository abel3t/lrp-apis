import { Module } from '@nestjs/common';
import { CareController } from './care.controller';
import { CareService } from './care.service';

@Module({
  imports: [],
  controllers: [CareController],
  providers: [CareService]
})
export class CareModule {}
