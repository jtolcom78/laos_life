import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../access-log/entities/access-log.entity';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';
import { RealEstate } from '../entities/real-estate.entity';
import { Job } from '../entities/job.entity';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(AccessLog)
        private accessLogRepository: Repository<AccessLog>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Car)
        private carRepository: Repository<Car>,
        @InjectRepository(RealEstate)
        private realEstateRepository: Repository<RealEstate>,
        @InjectRepository(Job)
        private jobRepository: Repository<Job>,
    ) { }

    async logAccess(ip: string, path: string, userAgent: string, userId?: number) {
        const log = this.accessLogRepository.create({ ip, path, userAgent, userId });
        await this.accessLogRepository.save(log);
    }

    async getAccessStats() {
        // Simple daily stats for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyVisits = await this.accessLogRepository
            .createQueryBuilder('log')
            .select("TO_CHAR(log.created_at, 'YYYY-MM-DD')", 'date')
            .addSelect("COUNT(log.id)", 'count')
            .where("log.created_at >= :sevenDaysAgo", { sevenDaysAgo })
            .groupBy("TO_CHAR(log.created_at, 'YYYY-MM-DD')")
            .orderBy('date', 'ASC')
            .getRawMany();

        const dailyNewUsers = await this.userRepository
            .createQueryBuilder('user')
            .select("TO_CHAR(user.created_at, 'YYYY-MM-DD')", 'date')
            .addSelect("COUNT(user.id)", 'count')
            .where("user.created_at >= :sevenDaysAgo", { sevenDaysAgo })
            .groupBy("TO_CHAR(user.created_at, 'YYYY-MM-DD')")
            .orderBy('date', 'ASC')
            .getRawMany();

        return { dailyVisits, dailyNewUsers };
    }

    async getContentViewStats() {
        const topCars = await this.carRepository.find({ order: { viewCount: 'DESC' }, take: 10 });
        const topRealEstates = await this.realEstateRepository.find({ order: { viewCount: 'DESC' }, take: 10 });
        const topJobs = await this.jobRepository.find({ order: { viewCount: 'DESC' }, take: 10 });

        return { topCars, topRealEstates, topJobs };
    }
}
