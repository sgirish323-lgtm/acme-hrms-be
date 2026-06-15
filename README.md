# Employee Salary Management System API

Backend service for managing and analyzing employee salary data across multiple countries.
Designed to replace manual Excel workflows with structured data, efficient queries, and insightful analytics dashboards.

---

## 🚀 Tech Stack

- **NodeJS** (v20.18.0+)
- **PostgreSQL** (v17.5)
- **TypeScript**
- **TypeORM**
- **Express.js**

---

## 📦 Getting Started

### Prerequisites

- Install NodeJS (v20.18.0+)
- Install PostgreSQL (v17.5)
- (Recommended) Install NVM for Node version management

---

## ⚙️ Setup

### 1. Clone & Install

```bash
cd <project_directory>
npm install
```

### 2. Environment Setup

```bash
cp .env.api.example .env.api
```

Update `.env.api` with database credentials and configs.

---

## 🐳 Running with Docker (Recommended)

Ensure Docker Desktop is installed and running.

```bash
docker-compose up -d
```

### Useful Commands

```bash
docker ps                       # list running containers
docker logs -f <container_name> # view logs
docker-compose stop             # stop services
docker-compose start            # restart services
docker-compose down             # remove containers
```

---

## 💻 Running Locally (Without Docker)

```bash
npm install
npm run build
npm run start
```

### Development Mode

```bash
npm run watch
```

---

## 📁 Project Structure

```
.
├── lib
│   ├── dto
│   ├── entities
│   ├── enums
│   ├── http-response
│   ├── i18n
│   ├── migrations
│   ├── schemas
│   ├── seeders
├── src
│   ├── dao
│   ├── middlewares
│   ├── routes
│   │   ├── route-name
│   │   │   ├── ${RouteName}Routes
│   │   │   ├── ${RouteName}Service
│   │   │   ├── ${RouteName}Validations
│   │   │   ├── index.ts
│   │   ├── index.ts
│   ├── utils
│   │   ├── common.ts
│   │   ├── validations.ts
│   ├── index.ts
├── package.json
├── tsconfig.json
├── .env.api.example
├── .env.api
├── README.md
```

### Root folders

- _lib_ - holds the whole common libraries
- _src_ - holds the whole express code structure

### lib folder

- _dto_ - holds the common dto wrapper
- _entities_ - holds the shared typeorm entities
- _enums_ - holds the shared enums
- _http-response_ - holds the http response wrapper
- _i18n_ - holds the localization logic & language files
- _migrations_ - holds the typeorm migrations
- _schemas_ - holds the shared schemas
- _seeders_ - holds the typeorm seeders

### src.\* server folder

- _dao_ - holds database queries
- _middlewares_ - holds express middlewares for processing http requests
- _routes_ - holds express routes
- _utils_ - contains common utils
- _index.ts_ - main entry point for server i.e. express server file

---

## 🧩 Architecture Overview

- **Routes Layer** → Handles HTTP requests & validation
- **Service Layer** → Business logic & orchestration
- **DAO Layer** → Database queries (TypeORM)
- **Lib Layer** → DTOs, entities, schemas, migrations & seeders, enums, utilities

# Database Migration Guide

This project uses **TypeORM** for managing database migrations with support for both automatic and manual generation. The migration system is environment-aware (e.g., `dev`, `stage`, `prod`) and uses a flexible CLI workflow.

## Database Configuration

The database connection is configured via `db-config.json` with environments.

```json
{
  "dev": {
    "host": "localhost",
    "port": 5432,
    "username": "dbUser",
    "password": "dbPassword",
    "database": "hrms-dev"
  }
}
```

> You will be prompted for any missing fields when running a migration.

## Usage

### 1. Generate Automatic Migration

Compare entity definitions with the current database and generate a migration file:

```bash
  npm run migrations:generate FILE_NAME
```

- `FILE_NAME`: Migration file name

> - Generates a migration file in `lib/migrations/<TIMESTAMP>-Auto_<FILE_NAME>.ts`.
> - This always uses the `dev` environment from `db-config.json`.
> - This process compares the current database schema with existing migration files, not the actual database state. If the latest migrations haven't been applied yet, the generated file may include changes from those pending migrations as well. Make sure your database is up-to-date before generating a new migration

### 2. Generate Manual Migration

Create a blank migration file to write SQL manually:

```bash
  npx typeorm migration:create ./lib/migrations/<MIGRATION_NAME>
```

### 3. Run Migrations

Apply all pending migrations to a specified environment:

```bash
  npm run migrations:migrate ENV
```

- `ENV`: optional (default: `dev`)

Examples:

```bash
  npm run migrations:migrate
```

```bash
  npm run migrations:migrate stage
```

### 4. Rollback Migrations

Undo one or more recent migrations:

```bash
  npm run migrations:rollback ENV LEVEL
```

- `ENV`: optional (default: `dev`)
- `LEVEL`: optional (default: `1`)

Examples:

```bash
  npm run migrations:rollback
```

```bash
  npm run migrations:rollback dev
```

```bash
  npm run migrations:rollback stage 2
```

### 5. Create Seeder File

Create a new seeder file:

```bash
  npm run seeders:create FILE_NAME
```

### 6. Run Seeders

Apply all pending seeders to a specified environment:

```bash
  npm run seeders:seed ENV
```

- `ENV`: optional (default: `dev`)

Examples:

```bash
  npm run seeders:seed
```

```bash
  npm run seeders:seed stage
```

### 7. Rollback Seeders

Undo one or more recent seeders:

```bash
  npm run seeders:rollback ENV LEVEL
```

- `ENV`: optional (default: `dev`)
- `LEVEL`: optional (default: `1`)

Examples:

```bash
  npm run seeders:rollback
```

```bash
  npm run seeders:rollback dev
```

```bash
  npm run seeders:rollback stage 2
```

## Notes

- Migrations are executed through the custom `run-migrations.ts` file.
- Seeders are created through the custom `create-seeder.ts` file.
- Seeders are executed through the custom `run-seeders.ts` file.
- You can pass the database environment and rollback level through CLI arguments.

## Checklist

- [x] Entities are defined in `lib/entities`
- [x] Migrations are saved in `lib/migrations`
- [x] Seeders are saved in `lib/seeders`
- [x] `db-config.json` is used for DB credentials
- [x] Custom migration runner script is used
- [x] Custom seeder runner script is used

---

## 📊 Core Features

### Employee Management

- List employees
- Filter by name, country, department
- View employee details

### Salary Management

- Store base salary and bonus
- Update salary records
- Maintain salary history

### Analytics & Insights

- Average salary by country
- Average salary by department
- Top N highest paid employees
- Salary distribution across departments
