import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { RealEstate } from './entities/real-estate.entity';
import { Job } from './entities/job.entity';
import { Shop } from './entities/shop.entity';
import { Post } from './entities/post.entity';
import { Car } from './entities/car.entity';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
import { CarsModule } from './cars/cars.module';
import { JobsModule } from './jobs/jobs.module';
import { ShopsModule } from './shops/shops.module';
import { RealEstatesModule } from './real-estates/real-estates.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'j761006',
      database: 'laos_life_db',
      entities: [User, Category, Product, RealEstate, Job, Shop, Post, Car],
      synchronize: false,
    }),
    PostsModule,
    UploadModule,
    CarsModule,
    JobsModule,
    ShopsModule,
    RealEstatesModule,
    ProductsModule,
    CategoriesModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
