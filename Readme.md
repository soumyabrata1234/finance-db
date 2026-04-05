# Finance Data Processing and Access Control Backend

A RESTful backend API for a finance dashboard system with role-based access control, financial record management, and dashboard analytics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure
```
finance-backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── FinancialRecord.js  # Financial record schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── record.service.js
│   │   └── dashboard.service.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification + RBAC
│   │   └── errorHandler.js    # Global error handler
│   └── utils/
│       └── jwt.js             # Token sign/verify helpers
├── .env.example
├── .gitignore
├── app.js
├── server.js
└── package.json
```

## Setup and Installation

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works fine)

### Steps

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd finance-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

**4. Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## Roles and Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View records | ❌ | ✅ | ✅ |
| View dashboard | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

> New users are assigned the `viewer` role by default. An admin can upgrade roles via `PATCH /api/users/:id/role`.

## API Reference

All protected routes require the following header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth

#### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "Soumya Sinha",
  "email": "soumya@example.com",
  "password": "123456"
}
```
**Response `201`:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": {
      "id": "...",
      "name": "Soumya Sinha",
      "email": "soumya@example.com",
      "role": "viewer"
    }
  }
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "soumya@example.com",
  "password": "123456"
}
```
**Response `200`:** Same shape as register.

---

### Users _(Admin only)_

Already created Admin
Email - admin@admin.com,
Password- 123456

#### List all users
```
GET /api/users
```

#### Update user role
```
PATCH /api/users/:id/role
```
**Body:**
```json
{ "role": "analyst" }
```
Valid roles: `viewer`, `analyst`, `admin`

#### Update user status
```
PATCH /api/users/:id/status
```
**Body:**
```json
{ "isActive": false }
```

---

### Financial Records

#### Create a record _(Admin only)_
```
POST /api/records
```
**Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```
Valid types: `income`, `expense`

#### List records _(Analyst, Admin)_
```
GET /api/records
```
**Query params (all optional):**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by `income` or `expense` |
| `category` | string | Filter by category (case-insensitive) |
| `startDate` | date | Filter from this date |
| `endDate` | date | Filter up to this date |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

**Example:**
```
GET /api/records?type=income&category=salary&page=1&limit=5
```

**Response `200`:**
```json
{
  "success": true,
  "data": [...],
  "total": 25,
  "page": 1,
  "pages": 5
}
```

#### Get single record _(Analyst, Admin)_
```
GET /api/records/:id
```

#### Update record _(Admin only)_
```
PATCH /api/records/:id
```
**Body:** Any subset of record fields.

#### Delete record _(Admin only)_
```
DELETE /api/records/:id
```
> Records are **soft deleted** — they are marked `isDeleted: true` and excluded from all queries. No data is permanently removed.

---

### Dashboard _(Analyst, Admin)_

#### Summary
```
GET /api/dashboard/summary
```
**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 20000,
    "netBalance": 30000,
    "incomeCount": 10,
    "expenseCount": 8
  }
}
```

#### Category breakdown
```
GET /api/dashboard/by-category
```
**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "category": "Salary", "type": "income", "total": 40000, "count": 8 },
    { "category": "Rent", "type": "expense", "total": 12000, "count": 4 }
  ]
}
```

#### Monthly trends
```
GET /api/dashboard/trends
```
**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "period": "2026-03",
      "year": 2026,
      "month": 3,
      "income": 20000,
      "expenses": 8000,
      "net": 12000
    }
  ]
}
```

#### Recent activity
```
GET /api/dashboard/recent?limit=5
```

---

## Error Responses

All errors follow a consistent shape:
```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad request / validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already in use) |
| `500` | Internal server error |

## Design Decisions and Assumptions

**Soft delete over hard delete**
Financial records are sensitive data. Deleting them permanently is lossy and unrecoverable. Using `isDeleted: true` preserves the data while hiding it from all queries.

**Role stored in JWT**
The user's role is embedded in the JWT payload at login time. This avoids a database lookup on every request. The tradeoff is that if a role is changed, the old token remains valid until it expires — acceptable for this scope.

**Service layer separation**
Controllers only handle HTTP concerns (parsing request, sending response). All business logic lives in services. This makes the logic independently testable and keeps controllers thin.

**Password never returned**
The `password` field on the User schema has `select: false`. It is only fetched explicitly in the login service when comparison is needed. It never appears in any API response.

**Default role is viewer**
New users get the least privileged role by default. An admin must explicitly upgrade them. This follows the principle of least privilege.

**MongoDB aggregation for dashboard**
Dashboard endpoints use MongoDB's `$group` and `$project` aggregation pipeline instead of fetching all records and computing in JavaScript. This keeps computation in the database layer and scales well.
