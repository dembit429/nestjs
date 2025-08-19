import type { UUID } from 'crypto';
import { Category } from './Category';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ObjectType,Field,ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Field()
  @Column({
    length: 50,
    nullable: false,
  })
  brand: string;

  @Field()
  @Column({
    length: 50,
    nullable: false,
  })
  model: string;

  @Field()
  @Column({
    nullable: false,
  })
  price: number;

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
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

  @Field(() => ID)
  @Column({ type: 'uuid', nullable: false })
  category_id: UUID;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
