import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealEstate } from '../entities/real-estate.entity';

@Injectable()
export class RealEstatesService {
    constructor(
        @InjectRepository(RealEstate)
        private realEstatesRepository: Repository<RealEstate>,
    ) { }

    findAll() {
        return this.realEstatesRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: number) {
        return this.realEstatesRepository.findOneBy({ id });
    }

    async remove(id: number) {
        await this.realEstatesRepository.delete(id);
    }
}
