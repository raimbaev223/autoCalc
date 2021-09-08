import { IsNumber } from 'class-validator';

export class RateModel {
  readonly id: number;

  @IsNumber()
  price: number;

  @IsNumber()
  distance: number;
}
