import { Module } from '@nestjs/common';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';

@Module({
  imports: [],
  controllers: [AbsenceController],
  providers: [AbsenceService]
})
export class AbsenceModule {}
