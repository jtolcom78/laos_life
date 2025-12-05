import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';

@Injectable()
export class ShopsService {
    constructor(
        @InjectRepository(Shop)
        private shopsRepository: Repository<Shop>,
    ) { }

    findAll() {
        return this.shopsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: number) {
        return this.shopsRepository.findOneBy({ id });
    }

    async remove(id: number) {
        await this.shopsRepository.delete(id);
    }
}
