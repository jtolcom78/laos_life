import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_FOLDERS = [
    'banners', 'posts', 'products', 'real_estates', 'rents', 'cars', 'jobs',
    'restaurants', 'repairs', 'cleaning', 'services', 'news', 'attachments',
    'profiles', 'others'
];

@Controller('upload')
export class UploadController {
    private supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { folder?: string }
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        let folder = body.folder || 'others';
        if (!ALLOWED_FOLDERS.includes(folder)) {
            folder = 'others';
        }

        const fileExt = extname(file.originalname);
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;

        const { data, error } = await this.supabase
            .storage
            .from('images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error('Upload failed');
        }

        const { data: publicUrlData } = this.supabase
            .storage
            .from('images')
            .getPublicUrl(fileName);

        return {
            url: publicUrlData.publicUrl,
        };
    }
}
