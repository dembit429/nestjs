import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/Category';
import { UUID } from 'crypto';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryResponseDto } from './dto/response-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<CategoryResponseDto[]> {
    try {
      return this.categoryRepository.find();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: UUID): Promise<CategoryResponseDto> {
    try {
      return this.categoryRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  async createCategory(
    category: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const existCategory = await this.categoryRepository.findOne({
        where: { watch_type: category.watch_type },
      });
      if (existCategory) {
        throw new Error('Category with this type already exists');
      }
      const newCategory = this.categoryRepository.create(category);
      return this.categoryRepository.save(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: UUID): Promise<boolean> {
    try {
      const result = await this.categoryRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }

  async updateCategory(
    id: UUID,
    category: UpdateCategoryDto,
  ): Promise<boolean> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!existingCategory) {
        throw new Error('Category not found');
      }
      await this.categoryRepository.update(id, category);
      return true;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }
}
