import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonCode } from './entities/common-code.entity';

@Injectable()
export class CommonCodeService {
    constructor(
        @InjectRepository(CommonCode)
        private commonCodeRepository: Repository<CommonCode>,
    ) { }

    // Find all codes by type, ordered by 'order'
    async findByType(type: string): Promise<CommonCode[]> {
        return this.commonCodeRepository.find({
            where: { type, isActive: true },
            order: { order: 'ASC' },
        });
    }

    // Create a new code (Admin usage)
    async create(codeData: Partial<CommonCode>): Promise<CommonCode> {
        const newCode = this.commonCodeRepository.create(codeData);
        return this.commonCodeRepository.save(newCode);
    }

    // Find all codes (Admin usage)
    async findAll(): Promise<CommonCode[]> {
        return this.commonCodeRepository.find({
            order: { type: 'ASC', order: 'ASC' },
        });
    }

    // Update a code
    async update(id: number, codeData: Partial<CommonCode>): Promise<CommonCode> {
        await this.commonCodeRepository.update(id, codeData);
        return this.commonCodeRepository.findOne({ where: { id } }) as Promise<CommonCode>;
    }

    // Delete a code
    async remove(id: number): Promise<void> {
        await this.commonCodeRepository.delete(id);
    }
}
