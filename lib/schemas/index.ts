import { EntityManager } from 'typeorm';

export interface Manager {
    manager?: EntityManager;
}

export interface CommonId {
    id: string;
}

export interface CommonSchemaProps extends CommonId {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface Pagination {
    page: number;
    perPage: number;
}

export * from './Country.schema';
