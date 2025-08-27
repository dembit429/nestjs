import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { ProductResponseDto } from './dto/response-product-dto';
import { CreateProductDto } from './dto/create-product-dto';
import { UUID } from 'crypto';
import { UpdateProductDto } from './dto/update-product-dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<ProductResponseDto[]> {
    try {
      return this.productService.getProducts();
    } catch (error) {
      throw error;
    }
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
    try {
      return this.productService.createProduct(product);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id') id: UUID): Promise<boolean> {
    try {
      return this.productService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async updateProduct(
    @Args('id') id: UUID,
    @Args('input') product: UpdateProductDto,
  ): Promise<boolean> {
    try {
      return this.productService.updateProduct(id, product);
    } catch (error) {
      throw error;
    }
  }
}
