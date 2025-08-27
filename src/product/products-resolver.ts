import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { ProductResponseDto } from './dto/response-product-dto';
import { CreateProductDto } from './dto/create-product-dto';
import { UUID } from 'crypto';
import { UpdateProductDto } from './dto/update-product-dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getProducts();
  }

  @Query(() => Product, { nullable: true })
  async getProductById(
    @Args('id', ParseUUIDPipe) id: UUID,
  ): Promise<ProductResponseDto> {
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

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', ParseUUIDPipe) id: UUID): Promise<boolean> {
    return this.productService.deleteProduct(id);
  }

  @Mutation(() => Boolean)
  async updateProduct(
    @Args('id', ParseUUIDPipe) id: UUID,
    @Args('input') product: UpdateProductDto,
  ): Promise<boolean> {
    return this.productService.updateProduct(id, product);
  }
}
