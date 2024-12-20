import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1111', 
  database: 'travelus',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
