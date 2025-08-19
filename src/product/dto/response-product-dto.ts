import { UUID } from 'crypto';

export interface ProductResponseDto {
  id: UUID;
  brand: string;
  model: string;
  price: number;
  category_id: any;
  created_at: Date;
  updated_at: Date;
}
