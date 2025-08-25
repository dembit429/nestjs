import { UUID } from 'crypto';

export interface CategoryResponseDto {
  id: UUID;
  watch_type: string;
  created_at: Date;
  updated_at: Date;
}
