import { Controller, Get, Param, Delete, Post, Body, Patch, Headers } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post()
    create(@Body() data: any) {
        return this.jobsService.create(data);
    }

    @Get()
    findAll(@Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.jobsService.findAllLocalized(targetLang);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
        const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
        return this.jobsService.findOneLocalized(+id, targetLang);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.jobsService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobsService.remove(+id);
    }
}
