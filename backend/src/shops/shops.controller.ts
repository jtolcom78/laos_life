import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) { }

    @Get()
    findAll() {
        return this.shopsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shopsService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shopsService.remove(+id);
    }
}
