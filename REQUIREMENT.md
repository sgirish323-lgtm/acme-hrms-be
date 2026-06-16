# Employee Salary Management System – Requirements

## Goal

Build a web-based system for HR Managers to manage and analyze salary data of 10,000 employees across multiple countries, replacing manual Excel-based workflows.

The system should enable efficient salary management and provide actionable insights into how the organization compensates employees.

---

## Users

* Primary: HR Manager

---

## Core Problems

* Manual Excel tracking is error-prone and hard to scale
* Difficult to generate insights across departments and geographies
* Lack of centralized and structured salary data

---

## Key Design Decisions

### 1. Single Currency Assumption

All salary data is stored in a normalized format using a single currency.

**Reason:**
Handling multiple currencies requires exchange rate management, historical conversions, and consistency rules, which are outside the scope of this MVP.

---

### 2. Database Choice

PostgreSQL is used as the primary database.

**Reason:**
Provides better support for aggregation queries, indexing, and scalability, aligning more closely with real-world systems.

---

### 3. Insights via Filters & Visualizations

Instead of relying on a full NLP-based query system, the application provides:

* Structured filters (country, department, etc.)
* Sorting and ranking (e.g., top earners)
* Graph-based visualizations for insights

**Reason:**
Most HR queries can be efficiently answered using structured exploration, which is more reliable, faster, and easier to maintain.

---

### 4. Optional NLP-Based Query Layer (Extensible)

The system is designed to be extensible with a lightweight NLP layer that can:

* Detect user intent from text queries
* Map queries to predefined analytics operations

Example:

* "Top 10 highest paid employees in India"
  → mapped to a pre-built query

**Note:**
This is not part of the MVP implementation but is considered in system design for future extensibility.

---

## Features (MVP Scope)

### 1. Employee Management

* View list of employees
* Search and filter by:

  * Name
  * Country
  * Department
* View employee details

---

### 2. Salary Management

* Store salary data:

  * Base salary
  * Bonus
* Update salary details
* Maintain basic salary history

---

### 3. Insights Dashboard

Provide visual insights using charts and aggregated data:

* Average salary by country
* Average salary by department
* Top N highest paid employees
* Salary distribution across departments

**Capabilities:**

* Filter by country and department
* Sort and rank employees
* View aggregated metrics

---

### 4. Analytics APIs

Backend endpoints to support dashboard:

* Average salary (by country/department)
* Top earners
* Salary distribution

These APIs are optimized using aggregation queries and indexing.

---

## Non-Goals (Deliberately Excluded)

* Authentication & Advanced Role-based access control
* Payroll processing
* Tax calculations
* Multi-currency support
* Real-time analytics
* Fully implemented NLP query engine

**Reason:**
Focus is on core data management, analytics, and system design quality within limited scope.

---

## Scale Considerations

* 10,000 employees
* Read-heavy workload (analytics queries)
* Indexed queries for performance
* Efficient aggregation using database capabilities

---

## Success Criteria

* HR can manage salary data without Excel
* Insights are accessible via filters and dashboards
* Analytics queries respond within acceptable latency (<2 seconds)
* Codebase is clean, maintainable, and testable
* Core business logic is covered by unit tests

---

## Future Enhancements

* NLP-based query interface for natural language questions
* Multi-currency support with exchange rate handling
* Authentication & Role-based access control
* Advanced analytics (trends, forecasting)

---
