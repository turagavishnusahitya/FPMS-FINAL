# Faculty Performance Portal

A comprehensive web application for faculty performance evaluation and management.

## Features

- **Faculty Dashboard**: Submit performance proofs and manage submissions
- **Admin Dashboard**: Review faculty submissions and provide scores
- **Authentication**: Secure login/signup for both faculty and admin users
- **Password Recovery**: Reset passwords using security codes
- **Draft System**: Save work in progress before final submission

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: bcryptjs for password hashing

## Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

### Database Setup

1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE faculty_performance;
   ```

2. Run the database schema:
   ```bash
   psql -U postgres -d faculty_performance -f database/schema.sql
   ```

3. Update the `.env` file in the `backend` directory with your database credentials:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=faculty_performance
   DB_PASSWORD=your_password_here
   DB_PORT=5432
   PORT=3000
   ```

### Installation

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Start the development servers:
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:3000`
- Frontend server on `http://localhost:5173`

### Default Test Accounts

After running the database schema, you can use these test accounts:

**Faculty Account:**
- ID: `VIT0021`
- Password: `password123` (you'll need to hash this and update the database)
- Security Code: `SEC123`

**Admin Account:**
- ID: `ADMIN001`
- Password: `admin123` (you'll need to hash this and update the database)
- Security Code: `ADMIN123`

## API Endpoints

### Authentication
- `POST /api/auth/faculty/login` - Faculty login
- `POST /api/auth/faculty/signup` - Faculty registration
- `POST /api/auth/faculty/reset-password` - Faculty password reset
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/admin/reset-password` - Admin password reset

### Faculty
- `POST /api/faculty/submit` - Submit final proof
- `POST /api/faculty/save-draft` - Save draft submission
- `GET /api/faculty/proof/:faculty_id` - Get faculty submission
- `DELETE /api/faculty/submission/:faculty_id` - Delete submission

### Admin
- `GET /api/admin/faculty-submissions` - Get all submitted faculty
- `GET /api/admin/proofs/:faculty_id` - Get faculty proof by ID
- `POST /api/admin/submit-score` - Submit scores for faculty

## Project Structure

```
faculty-performance-portal/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql
└── package.json
```

## Development

- Backend runs on port 3000
- Frontend runs on port 5173
- Database connection configured via environment variables
- CORS enabled for cross-origin requests
- Hot reload enabled for both frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.