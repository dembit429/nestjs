import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '../entity/Product';
import { Category } from '../entity/Category';
import { CreateCategoryTable1755094396184 } from '../migration/1755094396184-create-categoryTable';
import { CreateProductsTable1755094596185 } from '../migration/1755094596185-create-productsTable';
import dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Product, Category],
  migrations: [
    CreateCategoryTable1755094396184,
    CreateProductsTable1755094596185,
  ],
  subscribers: [],
  migrationsRun: false,
};

export default new DataSource(dataSourceOptions);
