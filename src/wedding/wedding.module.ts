import { Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { WeddingController } from './wedding.controller';

@Module({
  controllers: [WeddingController],
  providers: [WeddingService],
})
export class WeddingModule {}
