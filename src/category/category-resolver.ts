import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UUID } from 'crypto';
import { Category } from '../entity/Category';
import { CategoryService } from './category-service';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryResponseDto } from './dto/response-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  async getCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryService.getCategories();
  }

  @Query(() => Category, { nullable: true })
  async getCategoryById(@Args('id') id: UUID): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryById(id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Args('input') category: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(category);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('id') id: UUID): Promise<boolean> {
    return this.categoryService.deleteCategory(id);
  }

  @Mutation(() => Boolean)
  async updateCategory(
    @Args('id') id: UUID,
    @Args('input') category: UpdateCategoryDto,
  ): Promise<boolean> {
    return this.categoryService.updateCategory(id, category);
  }
}
