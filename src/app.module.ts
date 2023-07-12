import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaLib } from './prisma.lib';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaLib],
})
export class AppModule {}
