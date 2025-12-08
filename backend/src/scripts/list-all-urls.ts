
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listUrls() {
    console.log('Listing first 20 image URLs from each table...');
    const tables = ['post', 'job', 'banner', 'product', 'car', 'shop', 'real_estate'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(20);
        if (error || !data || data.length === 0) continue;

        console.log(`\n--- Table: ${table} ---`);
        data.forEach((row: any) => {
            const img = row.imageUrl || row.thumbnail || row.image || row.photo;
            if (img) console.log(img);
            if (row.images && Array.isArray(row.images)) console.log('Images:', row.images);
        });
    }
}

listUrls();
