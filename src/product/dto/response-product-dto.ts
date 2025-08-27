import { UUID } from 'crypto';

export interface ProductResponseDto {
  id: UUID;
  brand: string;
  model: string;
  price: number;
  category_id: UUID;
  created_at: Date;
  updated_at: Date;
}
