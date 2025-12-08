import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private jobsRepository: Repository<Job>,
        private translationService: TranslationService,
    ) { }

    create(data: any) {
        const job = this.jobsRepository.create(data);
        return this.jobsRepository.save(job);
    }

    findAll() {
        return this.jobsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findAllLocalized(lang: string) {
        const jobs = await this.jobsRepository.find({ order: { created_at: 'DESC' } });
        return Promise.all(jobs.map(async (job) => {
            const titleRes = await this.translationService.resolveContent(job.title, lang);
            const contentRes = await this.translationService.resolveContent(job.content, lang);
            return {
                ...job,
                title: titleRes.content,
                content: contentRes.content,
                isTranslated: titleRes.isTranslated || contentRes.isTranslated,
                originalLanguages: titleRes.availableLanguages
            };
        }));
    }

    async findOne(id: number) {
        const item = await this.jobsRepository.findOneBy({ id });
        if (item) {
            await this.jobsRepository.increment({ id }, 'viewCount', 1);
        }
        return item;
    }

    async findOneLocalized(id: number, lang: string) {
        const item = await this.findOne(id);
        if (!item) return null;

        const titleRes = await this.translationService.resolveContent(item.title, lang);
        const contentRes = await this.translationService.resolveContent(item.content, lang);

        return {
            ...item,
            title: titleRes.content,
            content: contentRes.content,
            isTranslated: titleRes.isTranslated || contentRes.isTranslated,
            originalLanguages: titleRes.availableLanguages
        };
    }

    async update(id: number, data: any) {
        await this.jobsRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.jobsRepository.delete(id);
    }
}
