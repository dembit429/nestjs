import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

@InputType()
export class UpdateProductDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string;

  @IsOptional()
  @Field({ nullable: true })
  @IsString()
  model?: string;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  @IsNumber()
  price?: number;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  @IsUUID()
  category_id?: UUID;
}
