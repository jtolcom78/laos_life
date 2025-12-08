import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class ShopsService {
    constructor(
        @InjectRepository(Shop)
        private shopsRepository: Repository<Shop>,
        private translationService: TranslationService,
    ) { }

    create(data: any) {
        const item = this.shopsRepository.create(data);
        return this.shopsRepository.save(item);
    }

    findAll() {
        return this.shopsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findAllLocalized(lang: string) {
        const items = await this.shopsRepository.find({ order: { created_at: 'DESC' } });
        return Promise.all(items.map(async (item) => {
            const nameRes = await this.translationService.resolveContent(item.name, lang);
            const locRes = await this.translationService.resolveContent(item.location, lang);
            const menuRes = await this.translationService.resolveContent(item.menuOrServices, lang);
            return {
                ...item,
                name: nameRes.content,
                location: locRes.content,
                menuOrServices: menuRes.content,
                isTranslated: nameRes.isTranslated || locRes.isTranslated || menuRes.isTranslated,
                originalLanguages: nameRes.availableLanguages
            };
        }));
    }

    async findOne(id: number) {
        return this.shopsRepository.findOneBy({ id });
    }

    async findOneLocalized(id: number, lang: string) {
        const item = await this.findOne(id);
        if (!item) return null;

        const nameRes = await this.translationService.resolveContent(item.name, lang);
        const locRes = await this.translationService.resolveContent(item.location, lang);
        const menuRes = await this.translationService.resolveContent(item.menuOrServices, lang);

        return {
            ...item,
            name: nameRes.content,
            location: locRes.content,
            menuOrServices: menuRes.content,
            isTranslated: nameRes.isTranslated || locRes.isTranslated || menuRes.isTranslated,
            originalLanguages: nameRes.availableLanguages
        };
    }

    async remove(id: number) {
        await this.shopsRepository.delete(id);
    }
}
