# Spa Booking System (MVP)

A simple full-stack spa booking application. Customers can browse services and book
appointments without an account; admins can log in to manage bookings and services.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, PostgreSQL (`pg`)
- **Auth:** JWT + bcrypt

## Project Structure

```text
spa-booking/
├── client/     React + Vite frontend
└── server/     Express + PostgreSQL backend
```

## Setup

### 1. Database

Create the database and load the schema + seed data:

```bash
createdb spa_booking
psql -d spa_booking -f server/database/schema.sql
psql -d spa_booking -f server/database/seed.sql
```

Generate a real admin password hash and update the seeded user:

```bash
cd server
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10).then(console.log)"
```

```sql
psql -d spa_booking
UPDATE users SET password = 'PASTE_HASH_HERE' WHERE email = 'admin@spabooking.com';
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your real DB credentials and a generated JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev
```

Server runs on `http://localhost:5000`. Verify with:

```bash
curl http://localhost:5000/api/health
```

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

App runs on `http://localhost:5173`.

## Default Admin Login

```text
Email:    admin@spabooking.com
Password: (whatever you set in the bcrypt hash step above)
```

## API Overview

| Method | Endpoint                     | Auth required |
|--------|-------------------------------|----------------|
| POST   | /api/auth/login                | No             |
| GET    | /api/services                   | No             |
| GET    | /api/services/:id                | No             |
| POST   | /api/services                     | Yes (admin)    |
| PUT    | /api/services/:id                  | Yes (admin)    |
| DELETE | /api/services/:id                    | Yes (admin)    |
| POST   | /api/bookings                          | No             |
| GET    | /api/bookings                           | Yes (admin)    |
| GET    | /api/bookings/:id                        | No             |
| PATCH  | /api/bookings/:id/status                   | No*            |
| DELETE | /api/bookings/:id                            | No*            |

\* Used by both the customer's "Cancel Booking" button and the admin dashboard.

## Out of Scope (Version 2)

Online payments, SMS/email notifications, customer accounts, Google Calendar sync,
multiple branches, loyalty points, reviews, analytics, mobile app, advanced staff scheduling.