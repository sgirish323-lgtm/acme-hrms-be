import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { DataSource, DataSourceOptions } from 'typeorm';
import { logger } from '@utils';

interface DBConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
}

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function getDbConfig(): Promise<DataSourceOptions> {
    const configPath = path.resolve(__dirname, './db-config.json');
    const dbEnvironment = process.argv[3] ?? 'dev';
    let dbConfig: DBConfig = {};

    if (fs.existsSync(configPath)) {
        try {
            const rawConfig = fs.readFileSync(configPath, 'utf-8');
            dbConfig = JSON.parse(rawConfig)[dbEnvironment] ?? {};

            logger.info(`✅ Loaded DB config from db-config.json for DB environment ${dbEnvironment} ✅`);
        } catch (error) {
            logger.warn(
                '❌ Failed to parse db-config.json for DB environment ${dbEnvironment}. falling back to manual input. ❌',
                error
            );
        }
    } else {
        logger.info('❌ No db-config.json found for DB environment ${dbEnvironment}. prompting for DB credentials. ❌');
    }

    dbConfig.host ??= await prompt('DB Host: ');

    dbConfig.port ??= parseInt(await prompt('DB Port: '), 10);

    dbConfig.username ??= await prompt('DB Username: ');

    dbConfig.password ??= await prompt('DB Password: ');

    dbConfig.database ??= await prompt('DB Name: ');

    return {
        type: 'postgres',
        synchronize: false,
        logging: 'all',
        entities: [path.resolve(__dirname, './lib/entities/**/*.entity.{ts,js}')],
        migrations: [path.resolve(__dirname, './lib/migrations/**/*.{ts,js}')],
        ...dbConfig,
    } as DataSourceOptions;
}

async function run() {
    const action = process.argv[2]?.toLowerCase() === 'rollback' ? 'rollback' : 'migrate';
    const rollbackCount = action === 'rollback' ? parseInt(process.argv[4] ?? '1', 10) : 1;

    logger.info(`👉Action: ${action.toUpperCase()}`, `${action === 'rollback' ? rollbackCount : ''} 👈`);

    const dataSourceConfig = await getDbConfig();

    const dataSource = new DataSource(dataSourceConfig);

    try {
        await dataSource.initialize();

        logger.info('✅ Connected to the database ✅');

        if (action === 'migrate') {
            await dataSource.runMigrations();

            logger.info('🚀 Migrations executed successfully 🚀');
        } else {
            for (let i = 0; i < rollbackCount; i++) {
                await dataSource.undoLastMigration();

                logger.info(`↩️ Rolled back migration ${i + 1} ↩️`);
            }
        }
    } catch (err) {
        logger.error('❌ Error during migration execution. ❌', err);
        process.exit(1);
    } finally {
        await dataSource.destroy();
    }
}

run();
