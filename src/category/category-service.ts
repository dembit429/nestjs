import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/Category';
import { UUID } from 'crypto';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryResponseDto } from './dto/response-category-dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  getCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryRepository.find();
  }

  getCategoryById(id: UUID): Promise<CategoryResponseDto> {
    return this.categoryRepository.findOne({ where: { id } }); 
  }

  createCategory(category: CreateCategoryDto): Promise<CategoryResponseDto> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }
}
