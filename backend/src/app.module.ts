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
import { CommonCode } from './common-code/entities/common-code.entity';
import { AccessLog } from './access-log/entities/access-log.entity';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
import { CarsModule } from './cars/cars.module';
import { JobsModule } from './jobs/jobs.module';
import { ShopsModule } from './shops/shops.module';
import { RealEstatesModule } from './real-estates/real-estates.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SearchModule } from './search/search.module';
import { CommonCodeModule } from './common-code/common-code.module';
import { StatisticsModule } from './statistics/statistics.module';
import { BannersModule } from './banners/banners.module';
import { Banner } from './banners/entities/banner.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Use connection string if available
      host: process.env.DATABASE_URL ? undefined : (process.env.SUPABASE_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com'),
      port: 6543,
      username: process.env.DATABASE_URL ? undefined : (process.env.SUPABASE_USER || 'postgres.htftpmuovlrzzvzuogii'),
      password: process.env.DATABASE_URL ? undefined : (process.env.SUPABASE_PASSWORD || 'j761006'),
      database: 'postgres',
      entities: [User, Category, Product, RealEstate, Job, Shop, Post, Car, CommonCode, AccessLog, Banner],
      synchronize: true, // Enable sync for dev to create tables
      ssl: {
        rejectUnauthorized: false, // Required for Supabase connection
      },
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
    CommonCodeModule,
    StatisticsModule,
    BannersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
