import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';


@Injectable()
export default class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  async onModuleDestroy() {

    await this.$disconnect();
    this.logger.debug('Database desconected');
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.debug('Database connected');
  }
}
