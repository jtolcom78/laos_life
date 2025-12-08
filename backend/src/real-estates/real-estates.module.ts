import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from '../entities/real-estate.entity';
import { RealEstatesController } from './real-estates.controller';
import { RealEstatesService } from './real-estates.service';

import { TranslationService } from '../common/translation.service';

@Module({
    imports: [TypeOrmModule.forFeature([RealEstate])],
    controllers: [RealEstatesController],
    providers: [RealEstatesService, TranslationService],
})
export class RealEstatesModule { }
