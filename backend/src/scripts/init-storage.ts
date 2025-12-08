
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the correct path (backend root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = 'images';

const FOLDERS = [
    'banners',
    'posts',
    'products',
    'real_estates',
    'rents',
    'cars',
    'jobs',
    'restaurants',
    'repairs',
    'cleaning',
    'services',
    'news',
    'attachments',
    'profiles',
    'others'
];

async function initFolders() {
    console.log('Initializing storage folders...');

    for (const folder of FOLDERS) {
        const fileName = `${folder}/.keep`;
        const fileContent = Buffer.from(''); // Empty file

        // Check if file mainly exists (optional, but good practice, though upload upsert works too)
        // We'll just try to upload with upsert: false. If it exists, we catch error or ignore. 
        // Actually, let's just use upsert: true to be safe and simple.

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(fileName, fileContent, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            console.error(`Failed to create folder '${folder}':`, error.message);
        } else {
            console.log(`Verified folder: ${folder}`);
        }
    }

    console.log('Storage initialization complete.');
}

initFolders();
