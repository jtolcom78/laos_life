import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) { }

  create(createBannerDto: CreateBannerDto) {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  findAll() {
    return this.bannerRepository.find({
      order: {
        sortOrder: 'ASC',
        created_at: 'DESC',
      },
    });
  }

  // Frontend will likely want only active banners
  findActive() {
    return this.bannerRepository.find({
      where: { isActive: true },
      order: {
        sortOrder: 'ASC',
        created_at: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.bannerRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    await this.bannerRepository.update(id, updateBannerDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.bannerRepository.delete(id);
  }
}
