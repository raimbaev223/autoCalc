import { IsString } from 'class-validator';

export class AutoModel {
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
