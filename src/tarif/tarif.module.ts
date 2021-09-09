import { Module } from '@nestjs/common';
import { TarifController } from './tarif.controller';
import { TarifService } from './tarif.service';

@Module({
  controllers: [TarifController],
  providers: [TarifService],
  imports: [],
  exports: [
    TarifService
  ]
})
export class TarifModule {}