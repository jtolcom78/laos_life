import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

import { TranslationService } from '../common/translation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Car])],
    controllers: [CarsController],
    providers: [CarsService, TranslationService],
})
export class CarsModule { }
