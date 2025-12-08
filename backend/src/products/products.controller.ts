import { Controller, Get, Param, Delete, Post, Body, Patch, Headers } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() data: any) {
        return this.productsService.create(data);
    }

    @Get()
    findAll(@Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.productsService.findAllLocalized(targetLang);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.productsService.findOneLocalized(+id, targetLang);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
