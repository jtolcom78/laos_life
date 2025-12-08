import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { AccessLog } from '../access-log/entities/access-log.entity';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';
import { RealEstate } from '../entities/real-estate.entity';
import { Job } from '../entities/job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AccessLog, User, Car, RealEstate, Job])],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule { }
