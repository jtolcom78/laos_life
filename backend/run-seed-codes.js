"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const common_code_entity_1 = require("./src/common-code/entities/common-code.entity");
async function runSql() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.SUPABASE_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        username: process.env.SUPABASE_DB_USER || 'postgres.htftpmuovlrzzvzuogii',
        password: process.env.SUPABASE_DB_PASSWORD || 'j761006',
        database: 'postgres',
        entities: [common_code_entity_1.CommonCode],
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
//# sourceMappingURL=run-seed-codes.js.map