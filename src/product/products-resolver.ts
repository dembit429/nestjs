import { Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { ProductResponseDto } from './dto/response-product-dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getProducts();
  }
}
