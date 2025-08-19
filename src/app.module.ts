import { Module } from '@nestjs/common';
import { ProductResolver } from './product/products-resolver';
import { ProductService } from './product/products-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { Product } from './entity/Product';
import { Category } from './entity/Category';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver,ApolloDriverConfig  } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Product, Category]),
  ],
  providers: [ProductService, ProductResolver],
})
export class AppModule {}

