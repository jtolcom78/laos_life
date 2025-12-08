import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
        private translationService: TranslationService,
    ) { }

    create(data: any) {
        const item = this.carsRepository.create(data);
        return this.carsRepository.save(item);
    }

    findAll() {
        return this.carsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findAllLocalized(lang: string) {
        const items = await this.carsRepository.find({ order: { created_at: 'DESC' } });
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
        const item = await this.carsRepository.findOneBy({ id });
        if (item) {
            await this.carsRepository.increment({ id }, 'viewCount', 1);
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
        await this.carsRepository.delete(id);
    }
}
