import {IsNotEmpty, IsString} from "class-validator";

export class CreateAutoDto {
  @IsNotEmpty()
  @IsString()
  carBrand: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;

  @IsNotEmpty()
  @IsString()
  carNumber: string;

  @IsNotEmpty()
  @IsString()
  carVIN: string;
}
