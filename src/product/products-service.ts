import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/Product';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductResponseDto } from './dto/response-product-dto';
import { UUID } from 'crypto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  getProducts(): Promise<ProductResponseDto[]> {
    return this.productRepository.find();
  }

  getProductById(id: UUID): Promise<ProductResponseDto> {
    return this.productRepository.findOne({ where: { id } });
  }

  createProduct(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }
}
