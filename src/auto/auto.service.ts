import { Injectable } from '@nestjs/common';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';
import {Pool} from "pg";

@Injectable()
export class AutoService {
  // create(createAutoDto: CreateAutoDto) {
  //   let query = createAutoDto
  //   let result;
  //   const pool = new Pool();
  //   (async () => {
  //     const client = await pool.connect()
  //     try {
  //       await client.query('BEGIN')
  //       // const queryText = `CREATE TABLE 'auto' IF NOT EXIST INSERT INTO "auto" VALUES(createAutoDto) RETURNING id`
  //       const queryText = `INSERT INTO cars VALUES(${query.carBrand},${query.carModel},${query.carNumber},${query.carVIN})`;
  //       const result = await client.query(queryText)
  //       await client.query('COMMIT')
  //     } catch (e) {
  //       await client.query('ROLLBACK')
  //       throw e
  //     } finally {
  //       client.release()
  //     }
  //   })().catch(e => console.error(e.stack))
  //   return result;
  // }

  findAll() {
    let result;
    const pool = new Pool();
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await pool.connect()
      try {
        result = await client.query('SELECT * FROM cars')
        console.log(result.rows)
        return result.rows
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  findOne(id: number) {
    let result;
    const pool = new Pool();
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    });

    const res = (async () => {
      const client = await pool.connect()
      try {
        result = await client.query(`SELECT * FROM cars WHERE id=${id}`)
        console.log(result.rows[0])
        return result.rows[0];
      } finally {
        client.release()
      }
    })().catch(err => console.log(err.stack))
    return res;
  }

  update(id: number, updateAutoDto: UpdateAutoDto) {
    return `This action updates a #${id} auto`;
  }

  remove(id: number) {
    return `This action removes a #${id} auto`;
  }
}
