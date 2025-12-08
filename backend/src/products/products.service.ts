import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private translationService: TranslationService,
    ) { }

    create(data: any) {
        const product = this.productsRepository.create(data);
        return this.productsRepository.save(product);
    }

    findAll() {
        return this.productsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findAllLocalized(lang: string) {
        const products = await this.productsRepository.find({ order: { created_at: 'DESC' } });
        return Promise.all(products.map(async (product) => {
            const titleRes = await this.translationService.resolveContent(product.title, lang);
            const descRes = await this.translationService.resolveContent(product.description, lang);
            return {
                ...product,
                title: titleRes.content,
                description: descRes.content,
                isTranslated: titleRes.isTranslated || descRes.isTranslated,
                originalLanguages: titleRes.availableLanguages
            };
        }));
    }

    async findOne(id: number) {
        const item = await this.productsRepository.findOneBy({ id });
        if (item) {
            await this.productsRepository.increment({ id }, 'viewCount', 1);
        }
        return item;
    }

    async findOneLocalized(id: number, lang: string) {
        const item = await this.findOne(id);
        if (!item) return null;

        const titleRes = await this.translationService.resolveContent(item.title, lang);
        const descRes = await this.translationService.resolveContent(item.description, lang);

        return {
            ...item,
            title: titleRes.content,
            description: descRes.content,
            isTranslated: titleRes.isTranslated || descRes.isTranslated,
            originalLanguages: titleRes.availableLanguages
        };
    }

    async remove(id: number) {
        await this.productsRepository.delete(id);
    }
}
