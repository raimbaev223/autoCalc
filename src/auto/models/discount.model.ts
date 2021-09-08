import { IsNumber } from 'class-validator';

export class DiscountModel {
  readonly id: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  duration: number;
}
