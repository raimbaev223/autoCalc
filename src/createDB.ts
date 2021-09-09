import {Pool} from "pg";

export class CreateDB {
  pool: Pool = new Pool()
  constructor() {
  }
  async createDb() {
    const client = await this.pool.connect()
    await client.query('CREATE TABLE IF NOT EXISTS "tarifs" ' +
      '(id SERIAL PRIMARY KEY, ' +
      'cost_per_day INT NOT NULL, ' +
      'distance_per_day INT NOT NULL)'
    );

    await client.query('CREATE TABLE IF NOT EXISTS "orders" ' +
      '(id SERIAL PRIMARY KEY, ' +
      'car_id INT REFERENCES cars(id) NOT NULL, ' +
      'booking_date TIMESTAMP NOT NULL, ' +
      'end_of_booking TIMESTAMP NOT NULL, ' +
      'tarif_id INT REFERENCES tarifs(id) NOT NULL, ' +
      'distance_per_order INT NOT NULL,' +
      'order_cost INT NOT NULL)'
    );

    await client.query('CREATE TABLE IF NOT EXISTS "cars" ' +
      '(id SERIAL PRIMARY KEY, ' +
      'car_brand TEXT NOT NULL, ' +
      'car_model TEXT NOT NULL, ' +
      'car_number TEXT NOT NULL, ' +
      'car_vin TEXT NOT NULL, ' +
      'last_order_date TIMESTAMP)'
    );

    console.log('Database created successfully')
    return 'Database created successfully';
  }
}