import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductResponseDto } from './dto/response-product-dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductResponse: ProductResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    brand: 'Apple',
    model: 'Watch Series 9',
    price: 399.99,
    category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  const mockCreateProductDto: CreateProductDto = {
    brand: 'Apple',
    model: 'Watch Series 9',
    price: 399.99,
    category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
  };

  const mockProduct: Product = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    brand: 'Apple',
    model: 'Watch Series 9',
    price: 399.99,
    category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  } as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [mockProductResponse];
      mockRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.getProducts();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getProducts();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.getProducts()).rejects.toThrow('Database connection failed');
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000' as any;

    it('should return a product when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockProductResponse);

      const result = await service.getProductById(productId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
      expect(result).toEqual(mockProductResponse);
    });

    it('should return null when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getProductById(productId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database query failed');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.getProductById(productId)).rejects.toThrow('Database query failed');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });
  });

  describe('createProduct', () => {
    it('should create and save a new product', async () => {
      const createdProduct = { ...mockCreateProductDto, id: mockProduct.id };
      
      mockRepository.create.mockReturnValue(createdProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.createProduct(mockCreateProductDto);

      expect(repository.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(repository.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Failed to create product');
      mockRepository.create.mockReturnValue(mockCreateProductDto);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.createProduct(mockCreateProductDto)).rejects.toThrow('Failed to create product');
      expect(repository.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(repository.save).toHaveBeenCalledWith(mockCreateProductDto);
    });

    it('should create product with different brands and models', async () => {
      const samsungWatch: CreateProductDto = {
        brand: 'Samsung',
        model: 'Galaxy Watch 6',
        price: 299.99,
        category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
      };
      const expectedProduct = { 
        ...mockProduct, 
        brand: 'Samsung', 
        model: 'Galaxy Watch 6',
        price: 299.99 
      };
      
      mockRepository.create.mockReturnValue(samsungWatch);
      mockRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.createProduct(samsungWatch);

      expect(repository.create).toHaveBeenCalledWith(samsungWatch);
      expect(repository.save).toHaveBeenCalledWith(samsungWatch);
      expect(result).toEqual(expectedProduct);
    });

    it('should create product with decimal prices', async () => {
      const expensiveWatch: CreateProductDto = {
        brand: 'Rolex',
        model: 'Submariner',
        price: 8100.50,
        category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
      };
      const expectedProduct = { 
        ...mockProduct, 
        brand: 'Rolex', 
        model: 'Submariner',
        price: 8100.50 
      };
      
      mockRepository.create.mockReturnValue(expensiveWatch);
      mockRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.createProduct(expensiveWatch);

      expect(repository.create).toHaveBeenCalledWith(expensiveWatch);
      expect(repository.save).toHaveBeenCalledWith(expensiveWatch);
      expect(result).toEqual(expectedProduct);
    });

    it('should handle different category IDs', async () => {
      const smartwatchDto: CreateProductDto = {
        brand: 'Garmin',
        model: 'Fenix 7',
        price: 699.99,
        category_id: '789e0123-e89b-12d3-a456-426614174222' as any,
      };
      const expectedProduct = { 
        ...mockProduct, 
        brand: 'Garmin', 
        model: 'Fenix 7',
        price: 699.99,
        category_id: '789e0123-e89b-12d3-a456-426614174222' as any
      };
      
      mockRepository.create.mockReturnValue(smartwatchDto);
      mockRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.createProduct(smartwatchDto);

      expect(repository.create).toHaveBeenCalledWith(smartwatchDto);
      expect(repository.save).toHaveBeenCalledWith(smartwatchDto);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('repository injection', () => {
    it('should inject the product repository', () => {
      expect(repository).toBeDefined();
      expect(repository).toBe(mockRepository);
    });
  });
});
