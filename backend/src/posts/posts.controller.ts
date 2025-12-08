import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Headers('accept-language') lang: string) {
    const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
    return this.postsService.findAllLocalized(targetLang);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('accept-language') lang: string) {
    const targetLang = lang ? lang.split(',')[0].split('-')[0] : 'lo';
    return this.postsService.findOneLocalized(+id, targetLang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
