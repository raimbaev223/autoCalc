import { Body, Controller, Post, Get, Param, Delete, Put } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post()
  create(@Body() data){
    return this.carsService.create(data);
  }

  @Get()
  findAll(){
    return this.carsService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.carsService.findById(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.carsService.delete(id)
  }

  @Put('/:id')
  update(@Body()data, @Param('id') id: number) {
    return this.carsService.update(data, id)
  }
}
