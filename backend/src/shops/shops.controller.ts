import { Controller, Get, Param, Delete, Post, Body, Patch, Headers } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) { }

    @Post()
    create(@Body() data: any) {
        return this.shopsService.create(data);
    }

    @Get()
    findAll(@Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.shopsService.findAllLocalized(targetLang);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.shopsService.findOneLocalized(+id, targetLang);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shopsService.remove(+id);
    }
}
