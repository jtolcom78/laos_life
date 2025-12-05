import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from '../entities/real-estate.entity';
import { RealEstatesController } from './real-estates.controller';
import { RealEstatesService } from './real-estates.service';

@Module({
    imports: [TypeOrmModule.forFeature([RealEstate])],
    controllers: [RealEstatesController],
    providers: [RealEstatesService],
})
export class RealEstatesModule { }
