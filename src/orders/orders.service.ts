import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CarsService } from 'src/cars/cars.service';
import { TarifService } from 'src/tarif/tarif.service';
import {Pool} from "pg";

@Injectable()
export class OrdersService {
  pool: Pool = new Pool()
  constructor(
    private tarifsService: TarifService,
    private carsService: CarsService,
  ){}

  async createOrder(data){
    const carExists = await this.carsService.findById(data.id)
    const tarifExists = await this.tarifsService.findById(data.tarif_id)
    if(!carExists || !tarifExists)
    {
      throw new HttpException('Авто с таким вин или тарифом нет!', HttpStatus.NOT_FOUND)
    }

    const today: any = new Date()

    console.log("прошло дней с последнего заказа: ", Math.abs(Math.floor((today - data.booking_date)/1000/60/60/24)))

    const lastOrderDate = new Date(carExists.lastOrderDate)
    lastOrderDate.setDate(lastOrderDate.getDate() + 3)

    const days = (data.end_of_booking - data.booking_date)/1000/60/60/24
    data.distance_per_order = days * tarifExists.distance_per_day

    if(lastOrderDate > data.booking_date) {
      throw new HttpException(`С момента последнего заказа должно пройти более 3х дней!`, HttpStatus.BAD_REQUEST)
    } else if(data.booking_date.getDay() === 0 || data.booking_date.getDay() === 6) {
      throw new HttpException("Извините, но аренда авто возможна только в будние дни", HttpStatus.BAD_REQUEST)
    } else if(days>30) {
      throw new HttpException("Извините, но аренда авто возможна не больше чем на 30 дней", HttpStatus.BAD_REQUEST)
    }

    data.orderCost = await this.calculate(days, tarifExists.cost_per_day)
    console.log("days: ", data.order_cost, tarifExists.cost_per_day)
    carExists.lastOrderDate = data.end_of_booking
    await this.carsService.update({last_order_date: data.end_of_booking}, data.id)

    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        data.lastOrderDate = new Date().toISOString();
        await client.query('BEGIN')

        const result = await client.query('INSERT INTO "orders" ' +
          '("car_id", "booking_date", "end_of_booking", "tarif_id", "distance_per_order", "order_cost")' +
          `VALUES ('${data.car_id}','${data.booking_date}','${data.end_of_booking}',` +
          `'${data.tarif_id}','${data.distance_per_order}','${data.order_cost}')`);

        await client.query('COMMIT');
        return 'New order added'
      }catch (e) {
        await client.query('ROLLBACK');
        throw e
      }finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  private async calculate(orderDays, cost) {
     let amount = 0
     if(orderDays >= 15) {
     amount = Math.floor(orderDays * cost - (orderDays * cost * 0.15))
       } else if(orderDays >= 6 && orderDays <= 14)
       {
          amount = Math.floor(orderDays * cost - (orderDays * cost * 0.10))
       } else if(rentalDays => 3 && rentalDays <= 5)
       {
          amount = Math.floor(orderDays * cost - (orderDays * cost * 0.05))
       } else {
          amount = Math.floor(orderDays * cost)
       }
       return amount
  }

  async findAll(){
    let result;
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        result = await client.query('SELECT * FROM "orders"')
        return result.rows
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async findById(id: number) {
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        const result = await client.query(`SELECT * FROM "orders" WHERE id=${id}`)
        return result.rows[0];
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async deleteOrder(id: number) {
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(`DELETE FROM "orders" WHERE "id"=${id}`)
      await client.query('COMMIT');
      return 'Car deleted'
    }catch (e) {
      await client.query('ROLLBACK');
      throw e
    }finally {
      client.release()
    }
    return 'Error'
  }

  async updateOrder(data, id: number){
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        data.lastOrderDate = new Date().toISOString();
        await client.query('BEGIN')
        console.log(data)

        await client.query(
          'UPDATE "cars"' +
          `SET "car_id"='${data.car_id}',"booking_date"='${data.booking_date}',` +
          `"end_of_booking"='${data.end_of_booking}',"tarif_id"='${data.tarif_id}',` +
          `"distance_per_order"='${data.distance_per_order}',"order_cost"='${data.order_cost}'` +
          ` WHERE "id"=${id}`
        )
        await client.query('COMMIT');
        return 'Order updated'
      }catch (e) {
        await client.query('ROLLBACK');
        throw e
      }finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }
}
