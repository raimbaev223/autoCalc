import {Controller, Post, Body, Delete, Get, Param, Put} from '@nestjs/common';
import { TarifService } from './tarif.service';

@Controller('tarifs')
export class TarifController {
  constructor(private tarifService: TarifService){}

  @Post()
  create(@Body() data){
    return this.tarifService.create(data)
  }
  @Get('/:id')
  getById(@Param('id') id: number){
      return this.tarifService.findById(id)
  }

  @Delete()
  delete(@Param('id') id: number){
      return this.tarifService.delete(id)
  }

  @Put('/:id')
  update(@Body()data, @Param('id') id: number) {
    return this.tarifService.update(data, id)
  }
}