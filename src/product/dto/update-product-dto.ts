import { InputType,Field,Float,ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

@InputType()
export class UpdateProductDto {
  @Field({nullable: true})
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @Field({nullable: true})
  @IsString()
  @IsNotEmpty()
  model?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsNotEmpty()
  category_id?: UUID;
}