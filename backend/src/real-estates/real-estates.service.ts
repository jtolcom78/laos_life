import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealEstate } from '../entities/real-estate.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class RealEstatesService {
    constructor(
        @InjectRepository(RealEstate)
        private realEstatesRepository: Repository<RealEstate>,
        private translationService: TranslationService,
    ) { }

    create(data: any) {
        const item = this.realEstatesRepository.create(data);
        return this.realEstatesRepository.save(item);
    }

    findAll() {
        return this.realEstatesRepository.find({ order: { created_at: 'DESC' } });
    }

    async findAllLocalized(lang: string) {
        const items = await this.realEstatesRepository.find({ order: { created_at: 'DESC' } });
        return Promise.all(items.map(async (item) => {
            const locRes = await this.translationService.resolveContent(item.location, lang);
            const descRes = await this.translationService.resolveContent(item.description, lang);
            return {
                ...item,
                location: locRes.content,
                description: descRes.content,
                isTranslated: locRes.isTranslated || descRes.isTranslated,
                originalLanguages: locRes.availableLanguages
            };
        }));
    }

    async findOne(id: number) {
        const item = await this.realEstatesRepository.findOneBy({ id });
        if (item) {
            await this.realEstatesRepository.increment({ id }, 'viewCount', 1);
        }
        return item;
    }

    async findOneLocalized(id: number, lang: string) {
        const item = await this.findOne(id);
        if (!item) return null;

        const locRes = await this.translationService.resolveContent(item.location, lang);
        const descRes = await this.translationService.resolveContent(item.description, lang);

        return {
            ...item,
            location: locRes.content,
            description: descRes.content,
            isTranslated: locRes.isTranslated || descRes.isTranslated,
            originalLanguages: locRes.availableLanguages
        };
    }

    async remove(id: number) {
        await this.realEstatesRepository.delete(id);
    }
}
