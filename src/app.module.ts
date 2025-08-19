import { Module } from '@nestjs/common';
import { ProductController } from './product/products-resolver';
import { ProductService } from './product/products-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { Product } from './entity/Product';
import { Category } from './entity/Category';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
