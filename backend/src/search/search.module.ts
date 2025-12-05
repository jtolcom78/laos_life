import { Module, Controller, Get, Query } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { RealEstate } from '../entities/real-estate.entity';
import { Product } from '../entities/product.entity';
import { Job } from '../entities/job.entity';
import { Shop } from '../entities/shop.entity';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('search')
export class SearchController {
    constructor(
        @InjectRepository(Car) private carRepo: Repository<Car>,
        @InjectRepository(RealEstate) private realEstateRepo: Repository<RealEstate>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Job) private jobRepo: Repository<Job>,
        @InjectRepository(Shop) private shopRepo: Repository<Shop>,
        @InjectRepository(Post) private postRepo: Repository<Post>,
    ) { }

    @Get()
    async search(@Query('q') q: string) {
        if (!q) return [];

        const keyword = `%${q}%`;

        const [cars, realEstates, products, jobs, shops, posts] = await Promise.all([
            this.carRepo.createQueryBuilder('c').where('c.brand LIKE :q OR c.model LIKE :q', { q: keyword }).getMany(),
            this.realEstateRepo.createQueryBuilder('r').where('r.location LIKE :q', { q: keyword }).getMany(),
            this.productRepo.createQueryBuilder('p').where('p.title LIKE :q OR p.description LIKE :q', { q: keyword }).getMany(),
            this.jobRepo.createQueryBuilder('j').where('j.industry LIKE :q', { q: keyword }).getMany(),
            this.shopRepo.createQueryBuilder('s').where('s.name LIKE :q OR s.category LIKE :q', { q: keyword }).getMany(),
            this.postRepo.createQueryBuilder('po').where('po.title LIKE :q OR po.content LIKE :q', { q: keyword }).getMany(),
        ]);

        return {
            cars,
            realEstates,
            products,
            jobs,
            shops,
            posts,
        };
    }
}

@Module({
    imports: [
        TypeOrmModule.forFeature([Car, RealEstate, Product, Job, Shop, Post]),
    ],
    controllers: [SearchController],
})
export class SearchModule { }
