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

  async getProducts(): Promise<ProductResponseDto[]> {
    try {
      return this.productRepository.find();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: UUID): Promise<ProductResponseDto> {
    try {
      return this.productRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { brand: product.brand, model: product.model },
      });
      if (existingProduct) {
        throw new Error('Product with this name already exists');
      }
      const newProduct = this.productRepository.create(product);
      return this.productRepository.save(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: UUID): Promise<boolean> {
    try {
      const result = await this.productRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }

  async updateProduct(id: UUID, product: CreateProductDto): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { id },
      });
      if (!existingProduct) {
        throw new Error('Product not found');
      }
      await this.productRepository.update(id, product);
      return true;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }
}
