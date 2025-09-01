import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCategoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  watch_type: string;
}
