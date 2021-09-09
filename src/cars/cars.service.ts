import { Injectable } from '@nestjs/common';
import {Pool} from "pg";

@Injectable()
export class CarsService {
  pool: Pool = new Pool()
  constructor(){

  }

  async create(data){
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        data.lastOrderDate = new Date().toISOString();
        await client.query('BEGIN')

        const result = await client.query('INSERT INTO "cars" ' +
          '("car_brand", "car_model", "car_number", "car_vin", "last_order_date")' +
        `VALUES ('${data.carBrand}','${data.carModel}','${data.carNumber}','${data.carVin}','${data.lastOrderDate}')`);
        await client.query('COMMIT');
        return 'New car added'
      }catch (e) {
        await client.query('ROLLBACK');
        throw e
      }finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async findAll(){
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        const result = await client.query('SELECT * FROM "cars"')
        return result.rows
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async findById(id: number) {
    let result;
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        result = await client.query(`SELECT * FROM "cars" WHERE id=${id}`)
        return result.rows[0];
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async delete(id: number) {
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(`DELETE FROM "cars" WHERE "id"=${id}`)
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

  async update(data, id: number){
    let result;
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

        result = await client.query(
          'UPDATE "cars"' +
          `SET "car_brand"='${data.carBrand}',"car_model"='${data.carModel}',` +
          `"car_number"='${data.carNumber}',"car_vin"='${data.carVin}',"last_order_date"='${data.lastOrderDate}'` +
          ` WHERE "id"=${id}`
        )
        await client.query('COMMIT');
        return 'Car updated'
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
