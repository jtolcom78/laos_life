import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CommonCode } from './entities/common-code.entity';

@Controller('common-codes')
export class CommonCodeController {
    constructor(private readonly commonCodeService: CommonCodeService) { }

    @Get(':type')
    findByType(@Param('type') type: string) {
        return this.commonCodeService.findByType(type);
    }

    @Post()
    create(@Body() codeData: Partial<CommonCode>) {
        return this.commonCodeService.create(codeData);
    }

    @Get()
    findAll() {
        return this.commonCodeService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() codeData: Partial<CommonCode>) {
        return this.commonCodeService.update(+id, codeData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commonCodeService.remove(+id);
    }
}
