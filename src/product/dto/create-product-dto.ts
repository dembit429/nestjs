import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  category_id: UUID;
}
