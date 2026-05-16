# KSA Digital Visa System

Full-stack Arabic government-style digital visa platform inspired by [Saudi MOFA Visa](https://visa.mofa.gov.sa/).

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React (Vite JSX), TailwindCSS, React Router, Axios, Lucide React, React Hot Toast, html2canvas, jspdf, qrcode.react |
| Backend | Express.js, MySQL2, JWT, Multer, bcrypt, QRCode, CORS, dotenv |
| Database | MySQL |

## Project Structure

```
visa-arabic/
├── frontend/          # React Vite app
├── backend/
│   ├── server.js      # Single API file
│   └── uploads-visa-arabic/
├── database/
│   └── visa_system.sql
└── README.md
```

## Prerequisites

- Node.js 18+
- MySQL 8+

## Setup Instructions

### 1. Database

```bash
mysql -u root -p < database/visa_system.sql
```

Default admin (after import):
- **Email:** `admin@ksa.com`
- **Password:** `admin123`

If login fails, seed admin via API after starting backend:

```bash
curl -X POST http://localhost:5000/api/seed-admin
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=visa_system
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads-visa-arabic
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | Yes | Current admin |
| GET | `/api/dashboard/stats` | Yes | Dashboard statistics |
| GET | `/api/visas` | Yes | List visas (search, filter, pagination) |
| GET | `/api/visas/:id` | No | Get visa by ID (public preview) |
| POST | `/api/visas/inquiry` | No | Inquiry by passport + visa number |
| POST | `/api/visas` | Yes | Create visa + auto QR |
| PUT | `/api/visas/:id` | Yes | Update visa |
| DELETE | `/api/visas/:id` | Yes | Delete visa |
| POST | `/api/visas/:id/regenerate-qr` | Yes | Regenerate QR code |
| PUT | `/api/settings/password` | Yes | Change admin password |
| POST | `/api/seed-admin` | No | Seed default admin (dev) |

## Features

- Landing page (Hero, Services, Inquiry, Features, FAQ, Footer)
- Admin dashboard with stats & charts
- Visa CRUD with modals, search, pagination, filters
- Saudi-style e-Visa preview (A4, bilingual, QR, barcode)
- QR scan opens `/visa/:id`
- PDF export & print
- Dark mode, responsive sidebar drawer
- JWT authentication

## QR Code Flow

1. On visa creation, backend generates QR pointing to `{FRONTEND_URL}/visa/{id}`
2. Scanning QR opens public visa preview page
3. User can print or download PDF

## Production Build

```bash
cd frontend && npm run build
cd backend && npm start
```

Set `FRONTEND_URL` to your production domain for correct QR links.

## License

Demo project for educational purposes.
# visa-arabic
