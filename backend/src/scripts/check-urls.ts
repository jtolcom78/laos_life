
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUrls() {
    console.log('Checking for LOCALHOST or relative URLs in ALL tables...');

    // List of probable table names
    const tables = ['banner', 'post', 'job', 'product', 'car', 'shop', 'real_estate'];

    for (const table of tables) {
        // Try fetching to see if table exists
        const { data, error } = await supabase.from(table).select('*');

        if (error) {
            // console.log(`Table '${table}' might not exist or error: ${error.message}`);
            continue;
        }

        if (!data || data.length === 0) {
            console.log(`Table '${table}' is empty.`);
            continue;
        }

        data.forEach((row: any) => {
            // Check common image fields
            const images = [row.imageUrl, row.thumbnail, row.image, row.photo].filter(Boolean);

            // Start checking sub-images if array
            if (row.images && Array.isArray(row.images)) images.push(...row.images);

            let foundLocal = false;
            images.forEach(img => {
                if (typeof img === 'string' && (img.includes('localhost') || !img.startsWith('http'))) {
                    console.log(`[${table}] ID: ${row.id} -> ${img}`);
                    foundLocal = true;
                }
            });
        });
    }
    console.log('Check complete.');
}

checkUrls();
