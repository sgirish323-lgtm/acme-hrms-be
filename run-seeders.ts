import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { DataSource, DataSourceOptions } from 'typeorm';
import { logger } from '@utils';

interface SeederRecord {
    id: number;
    timestamp: number;
    name: string;
}

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
        ...dbConfig,
    } as DataSourceOptions;
}

async function run() {
    const seedsPath = path.resolve(__dirname, './lib/seeders');
    const action = process.argv[2]?.toLowerCase() === 'rollback' ? 'rollback' : 'seed';
    const rollbackCount = action === 'rollback' ? parseInt(process.argv[4] ?? '1', 10) : 1;

    logger.info(`👉Action: ${action.toUpperCase()}`, `${action === 'rollback' ? rollbackCount : ''} 👈`);

    const dataSourceConfig = await getDbConfig();

    const dataSource = new DataSource(dataSourceConfig);

    try {
        await dataSource.initialize();

        logger.info('✅ Connected to the database ✅');

        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS seeders (
                id SERIAL PRIMARY KEY,
                "timestamp" BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
                name VARCHAR NOT NULL
            );
        `);

        const seederFiles = fs
            .readdirSync(seedsPath)
            .filter(fileName => fileName.endsWith('.ts') || fileName.endsWith('.js'))
            .sort();

        if (action === 'seed') {
            const executedSeeders: string[] = (await queryRunner.query(`SELECT name FROM seeders`)).map(
                (i: SeederRecord) => i.name
            );

            if (!seederFiles.length) {
                logger.error('❌ No seeder files found. ❌');
            }

            if (seederFiles.length === executedSeeders.length) {
                logger.error('❌ No seeders are pending to seed. ❌');
            }

            for (const seederFile of seederFiles) {
                const fileName = seederFile.replace('.ts', '');

                if (executedSeeders.includes(fileName)) {
                    continue;
                }

                const seedModule = await import(path.join(seedsPath, fileName));

                const seedFn = seedModule.up;

                if (typeof seedFn !== 'function') {
                    logger.warn(`⚠️ Skipping ${fileName} — no exported function named up ⚠️`);
                    continue;
                }

                logger.info(`🚀 Running seeder: ${fileName} 🚀`);

                await seedFn(dataSource);

                await queryRunner.query(`INSERT INTO seeders (name) VALUES ($1)`, [fileName]);

                logger.info(`✅ Seeded: ${fileName} ✅`);
            }
        } else if (action === 'rollback') {
            const executedSeeds: SeederRecord[] = await queryRunner.query(
                `SELECT * FROM seeders ORDER BY "timestamp" DESC LIMIT $1`,
                [rollbackCount]
            );

            if (!executedSeeds.length) {
                logger.error('❌ No seeders are pending to rollback. ❌');
            }

            for (const seed of executedSeeds) {
                const seedFile = seed.name;

                const seedModule = await import(path.join(seedsPath, seedFile));

                const rollbackFn = seedModule.down;

                if (typeof rollbackFn !== 'function') {
                    logger.warn(`⚠️ Cannot rollback ${seedFile} — no exported function named down ⚠️`);
                    continue;
                }

                logger.info(`↩️ Rolling back seeder: ${seedFile} ↩️`);

                await rollbackFn(dataSource);

                await queryRunner.query(`DELETE FROM seeders WHERE "timestamp" = $1`, [seed.timestamp]);

                logger.info(`✅ Rolled back: ${seedFile} ✅`);
            }
        }

        await queryRunner.release();
    } catch (err) {
        logger.error('❌ Error during seeding ❌', err);
        process.exit(1);
    } finally {
        await dataSource.destroy();
    }
}

run();
