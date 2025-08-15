import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../products-service';
import { Product } from '../../entity/Product';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }
}
