import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
    ) { }

    findAll() {
        return this.carsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: number) {
        return this.carsRepository.findOneBy({ id });
    }

    async remove(id: number) {
        await this.carsRepository.delete(id);
    }
}
