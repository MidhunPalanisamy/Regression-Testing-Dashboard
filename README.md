# Regression Testing Dashboard (RTD)

Full-stack web application for managing software builds, test cases, and regression testing.

## Tech Stack

### Backend
- Spring Boot 3.2.5 (Java 17)
- MySQL Database
- JWT Authentication
- Spring Security
- JPA/Hibernate

### Frontend
- React 19 with Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- React Toastify

## Features

- JWT-based authentication (1 hour token validity)
- Role-based access control (Admin, Tester, Viewer)
- Dashboard with statistics and charts
- Build management
- Test case management
- Regression run execution
- User management (Admin only)
- Professional UI with Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd rtd-be
```

2. Create `.env` file in the root directory:
```env
DB_URL=jdbc:mysql://localhost:3306/rtd_db?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
JWT_EXPIRATION=3600000
```

3. Make sure MySQL is running and accessible

4. Run the application:
```bash
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd rtd-fe
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## Default Access

After starting the application:

1. Register a new account at `http://localhost:5173/register`
2. Choose your role (Admin, Tester, or Viewer)
3. Login and start using the dashboard

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

### Builds
- GET `/api/builds` - Get all builds
- GET `/api/builds/{id}` - Get build by ID
- POST `/api/builds` - Create build (Admin/Tester)
- PUT `/api/builds/{id}` - Update build (Admin/Tester)
- DELETE `/api/builds/{id}` - Delete build (Admin)

### Test Cases
- GET `/api/testcases` - Get all test cases
- GET `/api/testcases/build/{buildId}` - Get test cases by build
- POST `/api/testcases` - Create test case (Admin/Tester)
- PUT `/api/testcases/{id}` - Update test case (Admin/Tester)
- DELETE `/api/testcases/{id}` - Delete test case (Admin/Tester)

### Regression Runs
- GET `/api/regression` - Get all regression runs
- GET `/api/regression/build/{buildId}` - Get runs by build
- POST `/api/regression/execute/{buildId}` - Execute regression run (Admin/Tester)

### Users
- GET `/api/users` - Get all users (Admin)
- POST `/api/users` - Create user (Admin)
- PUT `/api/users/{id}` - Update user (Admin)
- DELETE `/api/users/{id}` - Delete user (Admin)

## Role Permissions

### Admin
- Full access to all features
- User management
- Create/Edit/Delete builds, test cases, and runs

### Tester
- Create and manage builds
- Create and manage test cases
- Execute regression runs
- View all reports

### Viewer
- Read-only access
- View dashboard and reports
- Cannot modify any data

## Database Schema

### users
- id, username, email, password, role, createdAt

### builds
- id, version, description, createdAt

### test_cases
- id, name, description, status, build_id

### regression_runs
- id, build_id, totalTests, passed, failed, executedAt
