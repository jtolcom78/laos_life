import { Controller, Get, Param, Delete } from '@nestjs/common';
import { RealEstatesService } from './real-estates.service';

@Controller('real-estates')
export class RealEstatesController {
    constructor(private readonly realEstatesService: RealEstatesService) { }

    @Get()
    findAll() {
        return this.realEstatesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.realEstatesService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.realEstatesService.remove(+id);
    }
}
