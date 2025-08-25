import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { ProductResponseDto } from './dto/response-product-dto';
import { CreateProductDto } from './dto/create-product-dto';
import { UUID } from 'crypto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getProducts();
  }

  @Query(() => Product, { nullable: true })
  async getProductById(@Args('id') id: UUID): Promise<ProductResponseDto> {
    try {
      return this.productService.getProductById(id);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('input') product: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(product);
  }
}
