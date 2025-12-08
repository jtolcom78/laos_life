import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCode } from './entities/common-code.entity';
import { CommonCodeController } from './common-code.controller';
import { CommonCodeService } from './common-code.service';

@Module({
    imports: [TypeOrmModule.forFeature([CommonCode])],
    controllers: [CommonCodeController],
    providers: [CommonCodeService],
    exports: [CommonCodeService],
})
export class CommonCodeModule { }
