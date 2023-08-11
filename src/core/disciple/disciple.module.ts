import { Module } from '@nestjs/common';
import { DiscipleController } from './disciple.controller';
import { DiscipleService } from './disciple.service';

@Module({
  imports: [],
  controllers: [DiscipleController],
  providers: [DiscipleService]
})
export class DiscipleModule {}
