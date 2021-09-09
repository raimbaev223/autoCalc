import { Body, Controller, Post, Get, Param, Delete, Put } from '@nestjs/common';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService){}
    @Post()
    create(@Body() data){
        return this.ordersService.createOrder(data);
    }

    @Get()
    findAll(){
        return this.ordersService.findAll();
    }

    @Get('/:id')
    findById(@Param('id') id: number) {
        return this.ordersService.findById(id);
    }

    @Delete('/:id')
    deleteCar(@Param('id') id: number) {
        return this.ordersService.deleteOrder(id)
    }

    @Put('/:id')
    updateCar(@Body() data, @Param('id') id: number) {
        return this.ordersService.updateOrder(data, id)
    }
}
