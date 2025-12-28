import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MeService, PrismaService],
  controllers: [MeController],
})
export class MeModule {}
