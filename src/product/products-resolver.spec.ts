import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './products-resolver';
import { ProductService } from './products-service';
import { Product } from '../entity/Product';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductResponseDto } from './dto/response-product-dto';

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let service: ProductService;

  const mockProductService = {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
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

  const mockProduct: Product = {
    id: '123e4567-e89b-12d3-a456-426614174000' as any,
    brand: 'Apple',
    model: 'Watch Series 9',
    price: 399.99,
    category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  } as Product;

  const mockCreateProductDto: CreateProductDto = {
    brand: 'Apple',
    model: 'Watch Series 9',
    price: 399.99,
    category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductResolver,
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [mockProductResponse];
      mockProductService.getProducts.mockResolvedValue(expectedProducts);

      const result = await resolver.getProducts();

      expect(service.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockProductService.getProducts.mockResolvedValue([]);

      const result = await resolver.getProducts();

      expect(service.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockProductService.getProducts.mockRejectedValue(error);

      await expect(resolver.getProducts()).rejects.toThrow('Service error');
      expect(service.getProducts).toHaveBeenCalledTimes(1);
    });

    it('should return multiple products', async () => {
      const multipleProducts = [
        mockProductResponse,
        {
          ...mockProductResponse,
          id: '456e7890-e89b-12d3-a456-426614174222' as any,
          brand: 'Samsung',
          model: 'Galaxy Watch 6',
          price: 299.99,
        },
      ];
      mockProductService.getProducts.mockResolvedValue(multipleProducts);

      const result = await resolver.getProducts();

      expect(service.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(multipleProducts);
      expect(result).toHaveLength(2);
    });
  });

  describe('getProductById', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000' as any;

    it('should return a product when found', async () => {
      mockProductService.getProductById.mockResolvedValue(mockProductResponse);

      const result = await resolver.getProductById(productId);

      expect(service.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProductResponse);
    });

    it('should return null when product not found', async () => {
      mockProductService.getProductById.mockResolvedValue(null);

      const result = await resolver.getProductById(productId);

      expect(service.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const error = new Error('Product not found');
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(resolver.getProductById(productId)).rejects.toThrow(
        'Product not found',
      );
      expect(service.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should handle different product IDs', async () => {
      const differentId = '789e0123-e89b-12d3-a456-426614174333' as any;
      const differentProduct = {
        ...mockProductResponse,
        id: differentId,
        brand: 'Garmin',
        model: 'Fenix 7',
      };
      mockProductService.getProductById.mockResolvedValue(differentProduct);

      const result = await resolver.getProductById(differentId);

      expect(service.getProductById).toHaveBeenCalledWith(differentId);
      expect(result).toEqual(differentProduct);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      mockProductService.createProduct.mockResolvedValue(mockProduct);

      const result = await resolver.createProduct(mockCreateProductDto);

      expect(service.createProduct).toHaveBeenCalledWith(mockCreateProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should handle service errors during creation', async () => {
      const error = new Error('Failed to create product');
      mockProductService.createProduct.mockRejectedValue(error);

      await expect(
        resolver.createProduct(mockCreateProductDto),
      ).rejects.toThrow('Failed to create product');
      expect(service.createProduct).toHaveBeenCalledWith(mockCreateProductDto);
    });

    it('should create product with different data', async () => {
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
        price: 299.99,
      };
      mockProductService.createProduct.mockResolvedValue(expectedProduct);

      const result = await resolver.createProduct(samsungWatch);

      expect(service.createProduct).toHaveBeenCalledWith(samsungWatch);
      expect(result).toEqual(expectedProduct);
    });

    it('should create expensive product', async () => {
      const expensiveWatch: CreateProductDto = {
        brand: 'Rolex',
        model: 'Submariner',
        price: 8100.5,
        category_id: '456e7890-e89b-12d3-a456-426614174111' as any,
      };
      const expectedProduct = {
        ...mockProduct,
        brand: 'Rolex',
        model: 'Submariner',
        price: 8100.5,
      };
      mockProductService.createProduct.mockResolvedValue(expectedProduct);

      const result = await resolver.createProduct(expensiveWatch);

      expect(service.createProduct).toHaveBeenCalledWith(expensiveWatch);
      expect(result).toEqual(expectedProduct);
    });

    it('should create product with different category', async () => {
      const watchWithDifferentCategory: CreateProductDto = {
        brand: 'Casio',
        model: 'G-Shock',
        price: 149.99,
        category_id: '789e0123-e89b-12d3-a456-426614174222' as any,
      };
      const expectedProduct = {
        ...mockProduct,
        brand: 'Casio',
        model: 'G-Shock',
        price: 149.99,
        category_id: '789e0123-e89b-12d3-a456-426614174222' as any,
      };
      mockProductService.createProduct.mockResolvedValue(expectedProduct);

      const result = await resolver.createProduct(watchWithDifferentCategory);

      expect(service.createProduct).toHaveBeenCalledWith(
        watchWithDifferentCategory,
      );
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('service dependency injection', () => {
    it('should inject the product service', () => {
      expect(service).toBeDefined();
      expect(service).toBe(mockProductService);
    });
  });

  describe('GraphQL decorators', () => {
    it('should have proper GraphQL query methods', () => {
      expect(typeof resolver.getProducts).toBe('function');
      expect(typeof resolver.getProductById).toBe('function');
    });

    it('should have proper GraphQL mutation methods', () => {
      expect(typeof resolver.createProduct).toBe('function');
    });
  });
});
