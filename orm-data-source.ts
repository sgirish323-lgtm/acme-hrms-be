import fs from 'fs';
import path from 'path';
import { DataSourceOptions, DataSource } from 'typeorm';
import { logger } from '@utils';

const configPath = path.resolve(__dirname, './db-config.json');
let dbConfig: Partial<DataSourceOptions> = {};

if (!fs.existsSync(configPath)) {
    logger.error('❌ db-config.json not found. exiting. ❌');
    process.exit(1);
}

try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    dbConfig = JSON.parse(rawConfig).dev ?? {};

    const requiredFields = ['host', 'port', 'username', 'password', 'database'];
    const missingFields = requiredFields.filter(field => !(field in dbConfig));

    if (missingFields.length > 0) {
        logger.error(`❌ Missing required DB config fields: ${missingFields.join(', ')} ❌`);
        process.exit(1);
    }

    logger.info('✅ Loaded and validated DB config from db-config.json ✅');
} catch (error) {
    logger.error('❌ Failed to parse db-config.json. ❌', error);
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    synchronize: false,
    logging: 'all',
    entities: [path.resolve(__dirname, './lib/entities/**/*.entity.{ts,js}')],
    migrations: [path.resolve(__dirname, './lib/migrations/**/*.{ts,js}')],
    ...dbConfig,
} as DataSourceOptions);
