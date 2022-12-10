import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './core/account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
