# Tej Makeup Artistry — Luxury Bridal & Editorial Web Application

A full-stack, haute-couture web application designed for a premier luxury bridal and editorial makeup artist. Features a responsive, editorial client interface (ivory/cream/beige with champagne gold accents, serif typography, and whitespace) and a private CMS administration portal for managing bookings, portfolio collections, services, client testimonials, and studio settings.

---

## 🌟 Key Features

### Public Client (`/client`)
- **Luxury Editorial Aesthetic**: Ivory, cream, and warm stone backgrounds accented with champagne gold hues, serif headings (`Cormorant Garamond`), and modern sans-serif body typography (`Montserrat`).
- **Dynamic Content**: Zero hardcoded information. All business details, contact numbers, studio hours, social links, stats, and hero copy are populated directly from the API.
- **Visual Portfolio & Masonry**: Dynamic category filtering (Bridal, Reception, Engagement, Editorial, Glamour) with full-screen swipeable lightbox and keyboard navigation.
- **Portfolio Detail Views (`/portfolio/:slug`)**: Multi-image look breakdowns, previous/next look navigation, and dynamic SEO metadata.
- **Interactive Before & After Slider**: Side-by-side touch-enabled transformation comparison slider.
- **Validated Booking Inquiry Engine**: Multi-step booking form with dynamic service selections and an instant **WhatsApp prefilled-message button** for concierge inquiries.
- **Instagram-Style Social Grid**: Behind-the-scenes visual journal linked directly to the artist's Instagram profile.
- **Direct Concierge Channels**: Floating WhatsApp concierge button with instant pre-filled greeting.

### Admin Atelier CMS (`/admin`)
- **JWT-Protected Administration**: Secure authentication with login rate-limiting and route protection.
- **Executive Dashboard**: Real-time metrics for portfolio items, services, testimonials, and new vs. confirmed bookings.
- **Multi-Image Portfolio Management**:
  - Simultaneous multi-file uploads with image preview thumbnails.
  - Interactive drag-and-drop / arrow reordering of image sequences.
  - One-click cover image designation.
  - Instant live/draft publishing and homepage featured toggles.
- **Client Booking CRM**:
  - Live filter by status (`New`, `Contacted`, `Discussion`, `Confirmed`, `Completed`, `Cancelled`).
  - Search by client name, phone, email, or venue.
  - Instant contact buttons: **Call** (`tel:`), **WhatsApp** (`https://wa.me/`), and **Email** (`mailto:`).
  - Inline status update dropdowns with automatic persistence.
- **Services & Offerings Management**: Complete CRUD for packages, duration, pricing, and bullet-point feature inclusions.
- **Testimonial Management**: Client review editor with star ratings, event dates, and avatar photo uploads.
- **Artist Biography (`/admin/about`)**: Manage founder bio, philosophy, signature style, awards, and career statistics.
- **Studio & SEO Settings (`/admin/settings`)**: Customize business name, phone, WhatsApp number, pre-filled greeting message, studio address, hours, and global SEO metadata.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Client** | React 18, Vite, Tailwind CSS, Framer Motion, React Router DOM v6, Axios, Lucide React, React Helmet Async |
| **Server** | Node.js (ES Modules), Express.js, Mongoose / MongoDB, Helmet, Express Rate Limit, Multer, Cloudinary v2, Bcrypt.js, JWT, Slugify |
| **Database** | MongoDB (with embedded fallback for instant zero-dependency local development) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Backend Setup (`/server`)
```bash
cd server
npm install

# Copy environment template
cp .env.example .env
```

Review or modify `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tejmakeup
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@tejmakeup.com
ADMIN_PASSWORD=adminpassword123
```

> **Note on Local MongoDB:**  
> If you do not have a local MongoDB daemon running, the backend will automatically initialize its embedded MongoDB instance and persist data in `.mongo-data/`. No external database installation is required for local testing!

### 3. Seed Database
Seed the admin account and sample data:
```bash
# Create or update default admin credentials
npm run seed:admin

# Populate 10 portfolio looks, 6 services, 5 testimonials, 5 bookings, and studio settings
npm run seed:data
```

Default Admin Credentials:
- **Email:** `admin@tejmakeup.com`
- **Password:** `adminpassword123`

### 4. Start Backend Server
```bash
npm run dev
# API running on http://localhost:5000
```

### 5. Frontend Setup (`/client`)
Open a new terminal:
```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.  
Visit [http://localhost:5173/admin](http://localhost:5173/admin) to log in to the admin portal.

---

## 📡 API Reference

### Public Endpoints
- `GET /api/portfolio` — List published portfolio looks (supports `?category=` and `?featured=`)
- `GET /api/portfolio/:slug` — Project detail with multi-images and previous/next links
- `GET /api/services` — List published bridal services and packages
- `GET /api/testimonials` — List client reviews and ratings
- `GET /api/before-after` — List transformation comparisons
- `GET /api/about` — Artist bio, accolades, and statistics
- `GET /api/settings` — Public studio contact, WhatsApp greeting, and SEO settings
- `POST /api/bookings` — Submit a new booking inquiry
- `POST /api/auth/login` — Sign in admin (rate limited: 10 attempts / 15 mins)

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
- `GET /api/auth/me` — Verify current user session
- `GET /api/stats` — Executive dashboard metrics and counts
- `GET /api/portfolio/admin/all` — Complete portfolio list with search & category filters
- `POST /api/portfolio` — Create new look with multi-image upload
- `PUT /api/portfolio/:id` — Update look, reorder images, update cover
- `DELETE /api/portfolio/:id` — Delete look and purge assets
- `GET /api/bookings` — Filterable bookings list with status queries
- `PUT /api/bookings/:id` — Update booking status
- `DELETE /api/bookings/:id` — Remove booking inquiry
- `POST /api/services` / `PUT /api/services/:id` / `DELETE /api/services/:id` — Services CRUD
- `POST /api/testimonials` / `PUT /api/testimonials/:id` / `DELETE /api/testimonials/:id` — Reviews CRUD
- `GET /api/about/admin` / `PUT /api/about` — Manage artist profile & portraits
- `PUT /api/settings` — Update site settings and contact numbers

---

## 🚢 Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user under **Database Access**.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or whitelist your deployment server IPs.
4. Obtain your connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/tejmakeup?retryWrites=true&w=majority`

### 2. Cloudinary Setup
1. Register on [Cloudinary](https://cloudinary.com/).
2. From the dashboard, copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Unified Deployment on Vercel (Recommended — Multi-Services)

This repository is pre-configured with a root `vercel.json` using **Vercel Services**, allowing you to deploy both the Express API and Vite React frontend together as a single unified project on one domain:

1. Import this repository into [Vercel](https://vercel.com/new).
2. Leave the **Root Directory** as `./` (repo root). Vercel will automatically read `vercel.json`.
3. Add Environment Variables in your Vercel Project Settings:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<A strong random 64-char string>`
   - `CLOUDINARY_CLOUD_NAME`: `<Your Cloud Name>`
   - `CLOUDINARY_API_KEY`: `<Your API Key>`
   - `CLOUDINARY_API_SECRET`: `<Your API Secret>`
4. Click **Deploy**.
5. Once deployed:
   - Frontend is served at `https://your-domain.vercel.app/`
   - API endpoints are served at `https://your-domain.vercel.app/api/*`

---

### 4. Alternative Separate Backend Deployment (Render / Railway)

#### Deploying on Render:
1. Create a new **Web Service** on [Render](https://render.com/) and connect your repository.
2. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<A strong random 64-char string>`
   - `CLOUDINARY_CLOUD_NAME`: `<Your Cloudinary Cloud Name>`
   - `CLOUDINARY_API_KEY`: `<Your Cloudinary API Key>`
   - `CLOUDINARY_API_SECRET`: `<Your Cloudinary API Secret>`
   - `CLIENT_URL`: `https://your-client-domain.vercel.app`
4. Deploy the service. Once deployed, run `npm run seed:admin` and `npm run seed:data` if needed.

---

## 🔒 Security Best Practices
- Helmet middleware enabled for secure HTTP headers.
- Rate limiting on `/api/auth/login` to prevent brute force attacks.
- Strict payload limits on request bodies.
- Passwords hashed using bcrypt with salt rounds of 12.
- JWT expiration set to 7 days.
- Zero secrets committed to version control.
