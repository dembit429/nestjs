import { Module } from '@nestjs/common';
import { ProductController } from './products-resolver';
import { ProductService } from './products-service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
