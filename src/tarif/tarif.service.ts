import { Injectable } from '@nestjs/common';
import {Pool} from "pg";


@Injectable()
export class TarifService {
  pool: Pool = new Pool()
  constructor(){}

  async create(data) {
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        data.lastOrderDate = new Date().toISOString();
        await client.query('BEGIN')

        const result = await client.query('INSERT INTO "tarifs" ' +
          '("cost_per_day", "distance_per_day")' +
          `VALUES ('${data.cost_per_day}','${data.distance_per_day}')`);
        await client.query('COMMIT');
        return 'New tarif added'
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
        const result = await client.query('SELECT * FROM "tarifs"')
        return result.rows
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async findById(id: number){
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await this.pool.connect()
      try {
        const result = await client.query(`SELECT * FROM "tarifs" WHERE id=${id}`)
        return result.rows[0];
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  async delete(id: number){
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(`DELETE FROM "tarifs" WHERE "id"=${id}`)
      await client.query('COMMIT');
      return 'Tarif deleted'
    }catch (e) {
      await client.query('ROLLBACK');
      throw e
    }finally {
      client.release()
    }
    return 'Error'
  }

  async update(data, id: number){
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

        const result = await client.query(
          'UPDATE "tarifs"' +
          `SET "cost_per_day"='${data.cost_per_day}',"distance_per_day"='${data.distance_per_day}'` +
          ` WHERE "id"=${id}`
        )
        await client.query('COMMIT');
        return 'Tarif updated'
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