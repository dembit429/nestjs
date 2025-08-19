import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { UUID } from 'crypto';
import { ProductResponseDto } from './dto/response-product-dto';
import { CreateProductDto } from './dto/create-product-dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getProducts();
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto): Promise<ProductResponseDto> {
    try {
      return this.productService.createProduct(product);
    } catch (err) {
      throw new Error(`Failed to create product: ${err.message}`);
    }
  }
}
