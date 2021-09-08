import { IsString } from 'class-validator';

export class Auto {
  readonly id: number;

  @IsString()
  carBrand: string;

  @IsString()
  carModel: string;

  @IsString()
  carNumber: string;

  @IsString()
  carVIN: string;
}
