import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const BUCKET_NAME = 'images';

async function migrate() {
    console.log('Starting migration via Supabase API...');

    // Upload Helper
    async function uploadAndGetUrl(localPathOrUrl: string): Promise<string | null> {
        if (!localPathOrUrl) return null;
        if (!localPathOrUrl.includes('localhost:3000/uploads/')) return localPathOrUrl;

        const filename = localPathOrUrl.split('/').pop();
        if (!filename) return localPathOrUrl;

        const localFilePath = path.join(UPLOADS_DIR, filename);
        if (!fs.existsSync(localFilePath)) {
            console.warn(`File not found: ${filename}`);
            return localPathOrUrl;
        }

        try {
            const fileBuffer = fs.readFileSync(localFilePath);
            const storagePath = `migrated/${filename}`;

            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, fileBuffer, { upsert: true, contentType: 'image/jpeg' }); // default mime

            if (error) throw error;

            const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
            console.log(`Uploaded: ${filename}`);
            return data.publicUrl;
        } catch (e: any) {
            console.error(`Upload error ${filename}:`, e.message);
            return localPathOrUrl;
        }
    }

    // 1. Posts (table: post)
    const { data: posts } = await supabase.from('post').select('*');
    if (posts) {
        for (const post of posts) {
            if (post.thumbnail && post.thumbnail.includes('localhost')) {
                const newUrl = await uploadAndGetUrl(post.thumbnail);
                if (newUrl && newUrl !== post.thumbnail) {
                    await supabase.from('post').update({ thumbnail: newUrl }).eq('id', post.id);
                }
            }
        }
        console.log(`Processed ${posts.length} posts`);
    }

    // 2. Products (table: product)
    const { data: products } = await supabase.from('product').select('*');
    if (products) {
        for (const p of products) {
            let changed = false;
            const newPhotos: string[] = [];
            if (Array.isArray(p.photos)) {
                for (const photo of p.photos) {
                    const newUrl = await uploadAndGetUrl(photo);
                    newPhotos.push(newUrl || photo);
                    if (newUrl !== photo) changed = true;
                }
                if (changed) {
                    await supabase.from('product').update({ photos: newPhotos }).eq('id', p.id);
                }
            }
        }
        console.log(`Processed ${products.length} products`);
    }

    // 3. Real Estate (table: real_estate)
    const { data: realEstates } = await supabase.from('real_estate').select('*');
    if (realEstates) {
        for (const re of realEstates) {
            let changed = false;
            const newPhotos: string[] = [];
            if (Array.isArray(re.photos)) {
                for (const photo of re.photos) {
                    const newUrl = await uploadAndGetUrl(photo);
                    newPhotos.push(newUrl || photo);
                    if (newUrl !== photo) changed = true;
                }
                if (changed) {
                    await supabase.from('real_estate').update({ photos: newPhotos }).eq('id', re.id);
                }
            }
        }
        console.log(`Processed ${realEstates.length} real estates`);
    }

    // 4. Shops (table: shop)
    const { data: shops } = await supabase.from('shop').select('*');
    if (shops) {
        for (const s of shops) {
            let changed = false;
            const newPhotos: string[] = [];
            if (Array.isArray(s.photos)) {
                for (const photo of s.photos) {
                    const newUrl = await uploadAndGetUrl(photo);
                    newPhotos.push(newUrl || photo);
                    if (newUrl !== photo) changed = true;
                }
                if (changed) {
                    await supabase.from('shop').update({ photos: newPhotos }).eq('id', s.id);
                }
            }
        }
        console.log(`Processed ${shops.length} shops`);
    }

    // 5. Cars (table: car)
    const { data: cars } = await supabase.from('car').select('*');
    if (cars) {
        for (const c of cars) {
            let changed = false;
            const newPhotos: string[] = [];
            if (Array.isArray(c.photos)) {
                for (const photo of c.photos) {
                    const newUrl = await uploadAndGetUrl(photo);
                    newPhotos.push(newUrl || photo);
                    if (newUrl !== photo) changed = true;
                }
                if (changed) {
                    await supabase.from('car').update({ photos: newPhotos }).eq('id', c.id);
                }
            }
        }
        console.log(`Processed ${cars.length} cars`);
    }

    console.log('Migration complete!');
}

migrate().catch(console.error);
