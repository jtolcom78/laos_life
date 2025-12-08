import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    try {
      console.log('Creating banner with payload:', JSON.stringify(createBannerDto, null, 2));
      return await this.bannersService.create(createBannerDto);
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Get('active')
  findActive() {
    return this.bannersService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    try {
      console.log(`Updating banner ${id} with payload:`, JSON.stringify(updateBannerDto, null, 2));
      return await this.bannersService.update(+id, updateBannerDto);
    } catch (error) {
      console.error(`Error updating banner ${id}:`, error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(+id);
  }
}
