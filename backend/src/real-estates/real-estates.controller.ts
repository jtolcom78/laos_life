import { Controller, Get, Param, Delete, Post, Body, Patch, Headers } from '@nestjs/common';
import { RealEstatesService } from './real-estates.service';

@Controller('real-estates')
export class RealEstatesController {
    constructor(private readonly realEstatesService: RealEstatesService) { }

    @Post()
    create(@Body() data: any) {
        return this.realEstatesService.create(data);
    }

    @Get()
    findAll(@Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.realEstatesService.findAllLocalized(targetLang);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.realEstatesService.findOneLocalized(+id, targetLang);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.realEstatesService.remove(+id);
    }
}
