
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CommonCode } from './src/common-code/entities/common-code.entity';

async function runSql() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.SUPABASE_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        username: process.env.SUPABASE_DB_USER || 'postgres.htftpmuovlrzzvzuogii',
        password: process.env.SUPABASE_DB_PASSWORD || 'j761006',
        database: 'postgres',
        entities: [CommonCode],
        synchronize: false,
    });

    await dataSource.initialize();
    console.log('DB Connected');

    const sqlPath = path.join(__dirname, 'insert_common_codes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await dataSource.query(sql);
    console.log('SQL Executed Successfully');

    await dataSource.destroy();
}

runSql().catch(console.error);
