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
  brand?: string;

  @Field({ nullable: true })
  @IsString()
  model?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  price?: number;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  category_id?: UUID;
}
