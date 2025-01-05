import { Controller } from '@nestjs/common';
import { WeddingService } from './wedding.service';

@Controller('wedding')
export class WeddingController {
  constructor(private readonly weddingService: WeddingService) {}
}
