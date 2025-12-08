
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = 'images';

// Map tables to folder names or default
const TABLE_FOLDER_MAP: Record<string, string> = {
    'banner': 'banners',
    'post': 'posts',
    'job': 'jobs',
    'product': 'products',
    'car': 'cars',
    'shop': 'restaurants', // Default shop to restaurants or check category
    'real_estate': 'real_estates'
};

async function migrateImages() {
    console.log('Starting image migration to Supabase...');

    const tables = ['banner', 'post', 'job', 'product', 'car', 'shop', 'real_estate'];

    for (const table of tables) {
        // Check if table exists
        const { data: rows, error } = await supabase.from(table).select('*');
        if (error || !rows || rows.length === 0) continue;

        console.log(`Processing table: ${table} (${rows.length} rows)`);

        for (const row of rows) {
            // Identify image field names
            const imageFields = ['imageUrl', 'thumbnail', 'image', 'photo'];

            for (const field of imageFields) {
                const url = row[field];
                if (!url || typeof url !== 'string') continue;

                // Skip if already on Supabase
                if (url.includes('supabase.co')) continue;

                console.log(`Migrating [${table}:${row.id}] ${field} -> ${url}`);

                try {
                    // 1. Download Image
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const contentType = response.headers['content-type'] || 'image/jpeg';
                    const ext = contentType.split('/')[1] || 'jpg';

                    // 2. Generate Path
                    const folder = TABLE_FOLDER_MAP[table] || 'others';
                    const fileName = `${folder}/${table}_${row.id}_${field}_${Date.now()}.${ext}`;

                    // 3. Upload to Supabase
                    const { error: uploadError } = await supabase.storage
                        .from(BUCKET)
                        .upload(fileName, response.data, { contentType, upsert: true });

                    if (uploadError) {
                        console.error(`  Upload failed: ${uploadError.message}`);
                        continue;
                    }

                    // 4. Get Public URL
                    const { data: publicData } = supabase.storage
                        .from(BUCKET)
                        .getPublicUrl(fileName);

                    const newUrl = publicData.publicUrl;

                    // 5. Update Database
                    const { error: updateError } = await supabase
                        .from(table)
                        .update({ [field]: newUrl })
                        .eq('id', row.id);

                    if (updateError) {
                        console.error(`  DB Update failed: ${updateError.message}`);
                    } else {
                        console.log(`  Success: ${newUrl}`);
                    }

                } catch (err) {
                    // console.error(`  Failed to migrate ${url}:`, err.message);
                    console.error(`  Failed to migrate ${url}`);
                }
            }
        }
    }
    console.log('Migration complete.');
}

migrateImages();
