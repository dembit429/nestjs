import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category-service';
import { Category } from '../entity/Category';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryResponseDto } from './dto/response-category-dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCategoryResponse: CategoryResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    watch_type: 'Smartwatch',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  const mockCreateCategoryDto: CreateCategoryDto = {
    watch_type: 'Smartwatch',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [mockCategoryResponse];
      mockRepository.find.mockResolvedValue(expectedCategories);

      const result = await service.getCategories();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });

    it('should return empty array when no categories exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getCategories();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.getCategories()).rejects.toThrow(
        'Database connection failed',
      );
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    const categoryId = '123e4567-e89b-12d3-a456-426614174000' as any;

    it('should return a category when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategoryResponse);

      const result = await service.getCategoryById(categoryId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should return null when category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getCategoryById(categoryId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database query failed');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.getCategoryById(categoryId)).rejects.toThrow(
        'Database query failed',
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });
  });

  describe('createCategory', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should create and save a new category', async () => {
      const createdCategory = {
        ...mockCreateCategoryDto,
        id: mockCategoryResponse.id,
      };

      mockRepository.findOne.mockImplementation(() => Promise.resolve(null)); // No existing category
      mockRepository.create.mockReturnValue(createdCategory);
      mockRepository.save.mockImplementation(() =>
        Promise.resolve(mockCategoryResponse),
      );

      const result = await service.createCategory(mockCreateCategoryDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { watch_type: mockCreateCategoryDto.watch_type },
      });
      expect(repository.create).toHaveBeenCalledWith(mockCreateCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(createdCategory);
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should throw error when category with same watch_type already exists', async () => {
      mockRepository.findOne.mockImplementation(() =>
        Promise.resolve(mockCategoryResponse),
      ); // Existing category

      await expect(
        service.createCategory(mockCreateCategoryDto),
      ).rejects.toThrow('Category with this type already exists');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { watch_type: mockCreateCategoryDto.watch_type },
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      const error = new Error('Failed to create category');
      mockRepository.findOne.mockImplementation(() => Promise.resolve(null)); // No existing category
      mockRepository.create.mockReturnValue(mockCreateCategoryDto);
      mockRepository.save.mockImplementation(() => Promise.reject(error));

      await expect(
        service.createCategory(mockCreateCategoryDto),
      ).rejects.toThrow('Failed to create category');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { watch_type: mockCreateCategoryDto.watch_type },
      });
      expect(repository.create).toHaveBeenCalledWith(mockCreateCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreateCategoryDto);
    });

    it('should create category with different watch types', async () => {
      const analogWatch: CreateCategoryDto = { watch_type: 'Analog' };
      const expectedResponse = {
        ...mockCategoryResponse,
        watch_type: 'Analog',
      };

      mockRepository.findOne.mockImplementation(() => Promise.resolve(null)); // No existing category
      mockRepository.create.mockReturnValue(analogWatch);
      mockRepository.save.mockImplementation(() =>
        Promise.resolve(expectedResponse),
      );

      const result = await service.createCategory(analogWatch);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { watch_type: analogWatch.watch_type },
      });
      expect(repository.create).toHaveBeenCalledWith(analogWatch);
      expect(repository.save).toHaveBeenCalledWith(analogWatch);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('repository injection', () => {
    it('should inject the category repository', () => {
      expect(repository).toBeDefined();
      expect(repository).toBe(mockRepository);
    });
  });
});
