import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private jobsRepository: Repository<Job>,
    ) { }

    findAll() {
        return this.jobsRepository.find({ order: { created_at: 'DESC' } });
    }

    findOne(id: number) {
        return this.jobsRepository.findOneBy({ id });
    }

    async remove(id: number) {
        await this.jobsRepository.delete(id);
    }
}
