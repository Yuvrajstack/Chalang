# Chalang Backend – Phase 2

## Project Overview
Chalang is a modular backend system developed using Spring Boot to provide secure user management and intelligent opportunity handling. The system is designed using a structured architecture where different functionalities are divided into independent modules.

Phase 2 focuses on backend implementation, REST API development, and database integration.

---

## Technologies Used
- Java 17+
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Maven

---

## Project Modules

### 1. Auth Module
Responsible for user registration and authentication setup.

**Features:**
- User registration API
- Stores user details in database
- Input validation

---

### 2. Opportunity Module
Handles creation and management of opportunities such as internships, courses, and scholarships.

**Features:**
- Add new opportunities
- Retrieve opportunity data
- Structured storage in database

---

### 3. Link Verification Module
Ensures safety and validity of links provided in opportunities.

**Features:**
- Validates links before access
- Basic filtering mechanism
- Prevents unsafe or invalid links

---

### 4. Browser & Logging Module
Tracks and analyzes URL activity.

**Features:**
- Accepts URL input via API
- Classifies URLs:
  - HTTPS → ALLOW
  - HTTP → WARN
  - Others → BLOCK
- Stores logs in database

---

## API Endpoints

### Auth Module
POST /auth/register

---

### Opportunity Module
POST /opportunity/add  
GET /opportunity/all

---

### Verification Module
POST /verify/link

---

### Browser Module
POST /browser/check

**Sample Request:**
```json
{
  "url": "https://google.com"
}

