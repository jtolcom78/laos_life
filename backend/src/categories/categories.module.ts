import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CategoriesService {
    constructor(@InjectRepository(Category) private repo: Repository<Category>) { }
    findAll() { return this.repo.find(); }
    findOne(id: number) { return this.repo.findOneBy({ id }); }
    create(data: Category) { return this.repo.save(data); }
}

@Controller('categories')
export class CategoriesController {
    constructor(private readonly service: CategoriesService) { }
    @Get() findAll() { return this.service.findAll(); }
    @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
    @Post() create(@Body() data: Category) { return this.service.create(data); }
}

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule { }
