import fs from 'fs';
import path from 'path';
import { logger } from '@utils';

const args = process.argv.slice(2);

const seederName = args[0] ?? '';

if (!seederName) {
    logger.error('❌ Please provide a seeder name ❌');
    process.exit(1);
}

if (!/^[a-z0-9_]+$/.test(seederName)) {
    logger.error('❌ Invalid seeder name. Only a-z, 0-9 and underscore (_) are allowed. ❌');
    process.exit(1);
}

const fileName = `${Date.now()}-${seederName}.ts`;
const seedersDir = path.resolve(__dirname, './lib/seeders');
const filePath = path.join(seedersDir, fileName);

const fileContent = `import { DataSource } from 'typeorm';

export async function up(dataSource: DataSource): Promise<void> {}

export async function down(dataSource: DataSource): Promise<void> {}
`;

if (!fs.existsSync(seedersDir)) {
    fs.mkdirSync(seedersDir, { recursive: true });
}

fs.writeFileSync(filePath, fileContent);

logger.info(`✅ Seeder created: lib/seeders/${fileName} ✅`);
