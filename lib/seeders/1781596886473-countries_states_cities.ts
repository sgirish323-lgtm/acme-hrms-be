import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CountryEntity } from '@entities';

export async function up(dataSource: DataSource): Promise<void> {
    const countriesRepo = dataSource.getRepository(CountryEntity);

    const filePath = path.join(__dirname, './data/countries.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const countries = JSON.parse(rawData);

    await countriesRepo.save(countries);
}

export async function down(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE TABLE "countries"');
}
