import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Field()
  @Column({
    length: 50,
    nullable: false,
  })
  watch_type: string;

  @Field()
  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category_id)
  products: Product[];
}
