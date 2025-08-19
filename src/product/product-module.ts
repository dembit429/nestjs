import { Module } from '@nestjs/common';
import { ProductResolver } from './products-resolver';
import { ProductService } from './products-service';

@Module({
  controllers: [ProductResolver],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
