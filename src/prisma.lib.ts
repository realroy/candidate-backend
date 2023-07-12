import {
  type INestApplication,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaLib extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('PrismaLib');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('beforeExit', async () => {
      try {
        this.logger.log('Prisma client is disconnecting');
        await app.close();
      } catch (error) {
        this.logger.error('Prisma client disconnect error', error);
        throw error;
      }
    });
  }
}
