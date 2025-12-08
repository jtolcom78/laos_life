import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../entities/shop.entity';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';

import { TranslationService } from '../common/translation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Shop])],
    controllers: [ShopsController],
    providers: [ShopsService, TranslationService],
})
export class ShopsModule { }
