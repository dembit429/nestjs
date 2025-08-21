import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  model: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  category_id: UUID;
}
