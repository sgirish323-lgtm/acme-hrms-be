# 📘 Planning & Architecture Design

## Employee Salary Management System (MVP)

---

## 1. System Overview

The system is a **web-based application** that enables HR Managers to:

- Manage employee salary data
- Perform structured search and filtering
- View aggregated salary insights via dashboards

The architecture is designed for:

- Simplicity
- Read-heavy analytics workloads
- Clean separation of concerns

---

## 2. High-Level Architecture

```
                ┌──────────────────────────┐
                │        Frontend          │
                │   (Dashboard + UI)       │
                └──────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │        API Layer         │
                │     (Node.js Server)     │
                └──────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌────────────────┐  ┌────────────────┐
│ Employee      │  │ Salary         │  │ Analytics      │
│ Module        │  │ Module         │  │ Module         │
└──────┬────────┘  └──────┬─────────┘  └──────┬─────────┘
       │                  │                   │
       └──────────────────┴───────────────────┘
                          │
                          ▼
                ┌──────────────────────────┐
                │       PostgreSQL         │
                │     (Primary DB)         │
                └──────────────────────────┘
```

---

## 3. Core Features

### Employee Management

- Create, update, and delete employees
- List employees with filtering (country, department)
- View employee details

### Salary Management

- Store salary records (base + bonus)
- Update salary entries
- Maintain salary history using effective dates

### Analytics & Insights

- Average salary by country
- Average salary by department
- Top N highest paid employees
- Salary distribution across departments

---

## 4. Core Components

### 4.1 Employee Module

**Responsibilities:**

- Store employee information
- Fetch employee list
- Apply filters and search

**Key Fields:**

- Name
- Country
- Department

---

### 4.2 Salary Module

**Responsibilities:**

- Store salary details
- Update salary records
- Maintain salary history

**Key Fields:**

- Base salary
- Bonus
- Effective date

---

### 4.3 Analytics Module

**Responsibilities:**

- Execute aggregation queries
- Return grouped data
- Support filtering inputs

---

## 5. Backend Architecture (Aligned with Folder Structure)

The backend follows a **feature-based modular architecture** with a layered approach.

---

### 📁 Folder Mapping

```
src/
 ├── dao/
 ├── middlewares/
 ├── routes/
 │    ├── employee/
 │    │     ├── employeeRoutes.ts
 │    │     ├── employeeService.ts
 │    │     ├── employeeValidations.ts
 │    │     ├── index.ts
 │    │
 │    ├── salary/
 │    ├── analytics/
 │    ├── index.ts
 │
 ├── utils/
 ├── index.ts
```

---

### 🔁 Layered Flow

```
Route Layer (routes/*Routes.ts)
            │
            ▼
Validation Layer (*Validations.ts)
            │
            ▼
Service Layer (*Service.ts)
            │
            ▼
DAO Layer (src/dao)
            │
            ▼
PostgreSQL
```

---

### 5.1 Route Layer (Controller Equivalent)

**Location:** `src/routes/<module>/<module>Routes.ts`

**Responsibilities:**

- Define API endpoints
- Handle HTTP requests & responses
- Call validation layer
- Invoke service layer

---

### 5.2 Validation Layer

**Location:** `src/routes/<module>/<module>Validations.ts`

**Responsibilities:**

- Validate request body, params, and query
- Ensure data correctness
- Prevent invalid data propagation

---

### 5.3 Service Layer

**Location:** `src/routes/<module>/<module>Service.ts`

**Responsibilities:**

- Contains business logic
- Applies filters and transformations
- Coordinates DAO calls
- Prepares response data

---

### 5.4 DAO Layer

**Location:** `src/dao/`

**Responsibilities:**

- Execute SQL queries
- Handle database interaction
- Return raw or aggregated data

---

### 5.5 Middleware Layer

**Location:** `src/middlewares/`

**Responsibilities:**

- Logging
- Error handling
- Request preprocessing
- Authentication (extensible)

---

### 5.6 Route Registration

**Location:** `src/routes/index.ts`

**Responsibilities:**

- Combine all module routes
- Attach to main app

---

### 5.7 Application Entry Point

**Location:** `src/index.ts`

**Responsibilities:**

- Initialize server
- Register middleware
- Mount routes
- Start application

---

## 6. Data Flow

```
HTTP Request
    │
    ▼
Route Handler
    │
    ▼
Validation
    │
    ▼
Service
    │
    ▼
DAO
    │
    ▼
PostgreSQL
    │
    ▼
Response → Client
```

---

## 7. Database Design

### 7.1 Employees Table

```
employees (
  id UUID PRIMARY KEY,
  name TEXT,
  country TEXT,
  department TEXT,
  created_at TIMESTAMP
)
```

---

### 7.2 Salaries Table

```
salaries (
  id UUID PRIMARY KEY,
  employee_id UUID,
  base_salary NUMERIC,
  bonus NUMERIC,
  effective_date DATE,
  created_at TIMESTAMP
)
```

---

### 7.3 Salary History

Maintained via multiple records in `salaries` using `effective_date`.

---

## 8. Analytics Query Design

### Average Salary by Country

```
SELECT e.country, AVG(s.base_salary + s.bonus) AS avg_salary
FROM employees e
JOIN salaries s ON e.id = s.employee_id
GROUP BY e.country;
```

---

### Average Salary by Department

```
SELECT e.department, AVG(s.base_salary + s.bonus) AS avg_salary
FROM employees e
JOIN salaries s ON e.id = s.employee_id
GROUP BY e.department;
```

---

### Top N Highest Paid Employees

```
SELECT e.name, (s.base_salary + s.bonus) AS total_salary
FROM employees e
JOIN salaries s ON e.id = s.employee_id
ORDER BY total_salary DESC
LIMIT $1;
```

---

### Salary Distribution

```
SELECT e.department, COUNT(*) AS total_employees
FROM employees e
JOIN salaries s ON e.id = s.employee_id
GROUP BY e.department;
```

---

## 9. API Design

### Employees

- `GET /employees`
- `POST /employees`
- `GET /employees/:id`
- `PUT /employees/:id`
- `DELETE /employees/:id`

---

### Salaries

- `GET /salaries`
- `POST /salaries`
- `GET /salaries/:id`
- `PUT /salaries/:id`
- `DELETE /salaries/:id`
- `GET /salaries/:employeeId/history`

---

### Analytics

- `GET /analytics/avg-salary-country`
- `GET /analytics/avg-salary-department`
- `GET /analytics/top-earners`
- `GET /analytics/distribution`

---

## 10. Indexing Strategy

- Index on `employees.country`
- Index on `employees.department`
- Index on `salaries.employee_id`
- Index on `salaries.effective_date`

---

## 11. Performance Considerations

- Indexed filtering fields
- Optimized aggregation queries
- Designed for ~10,000 employees
- Read-heavy workload optimization
- Efficient joins and grouping

---

## 12. Deployment Architecture

```
        ┌───────────────┐
        │   Frontend    │
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │   Backend     │
        │ (Node Server) │
        └──────┬────────┘
               │
               ▼
        ┌───────────────┐
        │ PostgreSQL DB │
        └───────────────┘
```

---

## 13. Summary

| Layer            | Responsibility   |
| ---------------- | ---------------- |
| Frontend         | UI + Dashboard   |
| Route Layer      | API + Controller |
| Service Layer    | Business logic   |
| DAO Layer        | DB queries       |
| PostgreSQL       | Data storage     |
| Analytics Module | Aggregations     |

---
