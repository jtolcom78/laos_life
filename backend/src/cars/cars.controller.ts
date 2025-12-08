import { Controller, Get, Param, Delete, Post, Body, Patch, Headers } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) { }

    @Post()
    create(@Body() data: any) {
        return this.carsService.create(data);
    }

    @Get()
    findAll(@Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.carsService.findAllLocalized(targetLang);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.carsService.findOneLocalized(+id, targetLang);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.carsService.remove(+id);
    }
}
