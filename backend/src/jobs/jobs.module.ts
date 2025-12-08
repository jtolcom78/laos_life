import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TranslationService } from '../common/translation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Job])],
    controllers: [JobsController],
    providers: [JobsService, TranslationService],
})
export class JobsModule { }
