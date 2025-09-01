import { Test, TestingModule } from '@nestjs/testing';
import { CategoryResolver } from './category-resolver';
import { CategoryService } from './category-service';
import { Category } from '../entity/Category';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryResponseDto } from './dto/response-category-dto';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;
  let service: CategoryService;

  const mockCategoryService = {
    getCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
  };

  const mockCategoryResponse: CategoryResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    watch_type: 'Smartwatch',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  const mockCategory: Category = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    watch_type: 'Smartwatch',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  } as Category;

  const mockCreateCategoryDto: CreateCategoryDto = {
    watch_type: 'Smartwatch',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryResolver,
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    resolver = module.get<CategoryResolver>(CategoryResolver);
    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [mockCategoryResponse];
      mockCategoryService.getCategories.mockResolvedValue(expectedCategories);

      const result = await resolver.getCategories();

      expect(service.getCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoryService.getCategories.mockResolvedValue([]);

      const result = await resolver.getCategories();

      expect(service.getCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockCategoryService.getCategories.mockRejectedValue(error);

      await expect(resolver.getCategories()).rejects.toThrow('Service error');
      expect(service.getCategories).toHaveBeenCalledTimes(1);
    });

    it('should return multiple categories', async () => {
      const multipleCategories = [
        mockCategoryResponse,
        {
          ...mockCategoryResponse,
          id: '456e7890-e89b-12d3-a456-426614174222' as any,
          watch_type: 'Analog',
        },
        {
          ...mockCategoryResponse,
          id: '789e0123-e89b-12d3-a456-426614174333' as any,
          watch_type: 'Digital',
        },
      ];
      mockCategoryService.getCategories.mockResolvedValue(multipleCategories);

      const result = await resolver.getCategories();

      expect(service.getCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(multipleCategories);
      expect(result).toHaveLength(3);
    });
  });

  describe('getCategoryById', () => {
    const categoryId = '123e4567-e89b-12d3-a456-426614174000' as any;

    it('should return a category when found', async () => {
      mockCategoryService.getCategoryById.mockResolvedValue(
        mockCategoryResponse,
      );

      const result = await resolver.getCategoryById(categoryId);

      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should return null when category not found', async () => {
      mockCategoryService.getCategoryById.mockResolvedValue(null);

      const result = await resolver.getCategoryById(categoryId);

      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const error = new Error('Category not found');
      mockCategoryService.getCategoryById.mockRejectedValue(error);

      await expect(resolver.getCategoryById(categoryId)).rejects.toThrow(
        'Category not found',
      );
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
    });

    it('should handle different category IDs', async () => {
      const differentId = '789e0123-e89b-12d3-a456-426614174333' as any;
      const differentCategory = {
        ...mockCategoryResponse,
        id: differentId,
        watch_type: 'Luxury',
      };
      mockCategoryService.getCategoryById.mockResolvedValue(differentCategory);

      const result = await resolver.getCategoryById(differentId);

      expect(service.getCategoryById).toHaveBeenCalledWith(differentId);
      expect(result).toEqual(differentCategory);
    });
  });

  describe('createCategory', () => {
    it('should create and return a new category', async () => {
      mockCategoryService.createCategory.mockResolvedValue(
        mockCategoryResponse,
      );

      const result = await resolver.createCategory(mockCreateCategoryDto);

      expect(service.createCategory).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should handle service errors during creation', async () => {
      const error = new Error('Failed to create category');
      mockCategoryService.createCategory.mockRejectedValue(error);

      await expect(
        resolver.createCategory(mockCreateCategoryDto),
      ).rejects.toThrow('Failed to create category');
      expect(service.createCategory).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );
    });

    it('should create category with different watch types', async () => {
      const analogWatch: CreateCategoryDto = {
        watch_type: 'Analog',
      };
      const expectedCategory = {
        ...mockCategoryResponse,
        watch_type: 'Analog',
      };
      mockCategoryService.createCategory.mockResolvedValue(expectedCategory);

      const result = await resolver.createCategory(analogWatch);

      expect(service.createCategory).toHaveBeenCalledWith(analogWatch);
      expect(result).toEqual(expectedCategory);
    });

    it('should create digital watch category', async () => {
      const digitalWatch: CreateCategoryDto = {
        watch_type: 'Digital',
      };
      const expectedCategory = {
        ...mockCategoryResponse,
        watch_type: 'Digital',
      };
      mockCategoryService.createCategory.mockResolvedValue(expectedCategory);

      const result = await resolver.createCategory(digitalWatch);

      expect(service.createCategory).toHaveBeenCalledWith(digitalWatch);
      expect(result).toEqual(expectedCategory);
    });

    it('should create luxury watch category', async () => {
      const luxuryWatch: CreateCategoryDto = {
        watch_type: 'Luxury',
      };
      const expectedCategory = {
        ...mockCategoryResponse,
        watch_type: 'Luxury',
      };
      mockCategoryService.createCategory.mockResolvedValue(expectedCategory);

      const result = await resolver.createCategory(luxuryWatch);

      expect(service.createCategory).toHaveBeenCalledWith(luxuryWatch);
      expect(result).toEqual(expectedCategory);
    });

    it('should create sports watch category', async () => {
      const sportsWatch: CreateCategoryDto = {
        watch_type: 'Sports',
      };
      const expectedCategory = {
        ...mockCategoryResponse,
        watch_type: 'Sports',
      };
      mockCategoryService.createCategory.mockResolvedValue(expectedCategory);

      const result = await resolver.createCategory(sportsWatch);

      expect(service.createCategory).toHaveBeenCalledWith(sportsWatch);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe('service dependency injection', () => {
    it('should inject the category service', () => {
      expect(service).toBeDefined();
      expect(service).toBe(mockCategoryService);
    });
  });

  describe('GraphQL decorators', () => {
    it('should have proper GraphQL query methods', () => {
      expect(typeof resolver.getCategories).toBe('function');
      expect(typeof resolver.getCategoryById).toBe('function');
    });

    it('should have proper GraphQL mutation methods', () => {
      expect(typeof resolver.createCategory).toBe('function');
    });
  });

  describe('input validation', () => {
    it('should accept valid CreateCategoryDto', async () => {
      const validDto: CreateCategoryDto = {
        watch_type: 'Mechanical',
      };
      const expectedResponse = {
        ...mockCategoryResponse,
        watch_type: 'Mechanical',
      };
      mockCategoryService.createCategory.mockResolvedValue(expectedResponse);

      const result = await resolver.createCategory(validDto);

      expect(service.createCategory).toHaveBeenCalledWith(validDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
