import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect()
      .then(() => {
        console.log('Prisma connected');
      })
      .catch((error) => {
        console.log('Prisma connection error', error);
      });
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', () => {
      void app.close();
    });
  }
}
