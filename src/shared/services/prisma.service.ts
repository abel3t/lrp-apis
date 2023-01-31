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

    this.$use(async (params, next) => {
      const useSoftDeleteModels: string[] = ['Member', 'Friend', 'Care'];

      if (useSoftDeleteModels.includes(params.model)) {
        switch (params.action) {
          case 'delete': {
            params.action = 'update';
            params.args['data'] = { isDeleted: true };

            break;
          }

          case 'deleteMany': {
            params.action = 'updateMany';
            if (params.args.data != undefined) {
              params.args.data['isDeleted'] = true;
            } else {
              params.args['data'] = { isDeleted: true };
            }

            break;
          }

          case 'findFirst':
          case 'findMany': {
            params.args['where'] = { isDeleted: false };

            break;
          }
        }
      }

      return next(params);
    });
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', () => {
      void app.close();
    });
  }
}
