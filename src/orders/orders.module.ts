import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TarifService } from 'src/tarif/tarif.service';
import { CarsService } from 'src/cars/cars.service';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    TarifService,
    CarsService
  ],
  imports:[]
})
export class OrdersModule {}
