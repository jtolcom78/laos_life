import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { TranslationService } from '../common/translation.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private translationService: TranslationService,
  ) { }

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find({ order: { created_at: 'DESC' } });
  }

  async findAllLocalized(lang: string) {
    const posts = await this.postsRepository.find({ order: { created_at: 'DESC' } });

    // Sequential processing to avoid Rate Limiting (429) from Google Translate
    const localizedPosts: any[] = [];
    for (const post of posts) {
      const titleRes = await this.translationService.resolveContent(post.title, lang);
      const contentRes = await this.translationService.resolveContent(post.content, lang);

      // Optional: We could save here too, but it might slow down listing significantly.
      // For now, we rely on Detail view to cache the full content.

      localizedPosts.push({
        ...post,
        title: titleRes.content,
        content: contentRes.content,
        isTranslated: titleRes.isTranslated || contentRes.isTranslated,
        originalLanguages: titleRes.availableLanguages
      });
    }

    return localizedPosts;
  }

  async findOneLocalized(id: number, lang: string) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) return null;

    const titleRes = await this.translationService.resolveContent(post.title, lang);
    const contentRes = await this.translationService.resolveContent(post.content, lang);

    // Lazy Caching: If content was auto-translated, save it to DB for next time
    let shouldUpdate = false;

    if (titleRes.isTranslated) {
      post.title = { ...post.title, [lang]: titleRes.content };
      shouldUpdate = true;
    }

    if (contentRes.isTranslated) {
      post.content = { ...post.content, [lang]: contentRes.content };
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      await this.postsRepository.save(post);
      // console.log(`Cached translation for Post #${id} in ${lang}`);
    }

    return {
      ...post,
      title: titleRes.content,
      content: contentRes.content,
      isTranslated: titleRes.isTranslated || contentRes.isTranslated,
      originalLanguages: titleRes.availableLanguages
    };
  }

  findOne(id: number) {
    return this.postsRepository.findOneBy({ id });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postsRepository.delete(id);
  }
}

