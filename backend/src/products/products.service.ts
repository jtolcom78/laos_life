import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    findAll() {
        return this.productsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: number) {
        return this.productsRepository.findOneBy({ id });
    }

    async remove(id: number) {
        await this.productsRepository.delete(id);
    }
}
