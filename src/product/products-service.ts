import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/Product';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductResponseDto } from './dto/response-product-dto';
import { UUID } from 'crypto';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<ProductResponseDto[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async getProductById(id: UUID): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { brand: product.brand, model: product.model },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with brand "${product.brand}" and model "${product.model}" already exists`,
        );
      }

      const newProduct = this.productRepository.create(product);
      return await this.productRepository.save(newProduct);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async deleteProduct(id: UUID): Promise<boolean> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const result = await this.productRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async updateProduct(id: UUID, product: UpdateProductDto): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      await this.productRepository.update(id, product);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update product');
    }
  }
}
