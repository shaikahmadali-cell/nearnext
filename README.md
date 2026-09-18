# 📍 Locora – Discover Local. Support Local.

A complete full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application empowering local communities by connecting patrons with neighborhood businesses, exclusive promotional deals, and direct merchant inquiry channels.

---

## 🌟 Key Features

### 1. 👤 Customer Experience
* **Discover Local Businesses**: Explore neighborhood merchants categorized across Food & Restaurants, Fashion, Electronics, Beauty & Salon, Healthcare, Education, Home Services, and Fitness.
* **Browse Exclusive Offers**: Filter promotions by category, city (Vijayawada, Guntur, Tenali), discount type (percentage, flat, BOGO, special deals), and validity.
* **Customer Reviews & Ratings**: Submit 1–5 star reviews with comments and view verified ratings breakdown.
* **Digital Pass / Voucher Generator**: Generate printable coupon passes with barcodes and promo codes for in-store or online redemption.
* **Interactive Directions**: Direct one-click Google Maps navigation to merchant storefronts.
* **Direct Enquiries**: Message store managers with reservations or service questions and receive replies.
* **Saved Deals Collection**: Bookmark favourite promotions for fast access in your Customer Dashboard.

### 2. 🏪 Business Owner Dashboard
* **Merchant Profile Management**: Set business name, bio, operating hours, phone, email, website, logo, and cover image.
* **Promotion Creator & Editor**: Publish deals with discount badges, original and discounted prices, promo codes, terms, and banner images.
* **Customer Enquiries & Replies**: Review patron questions and send direct in-app responses.
* **Business Analytics**: Monthly engagement metrics (Business Views, Offer Views, Enquiry Conversion).

### 3. 🛡️ Admin Console
* **Platform Metrics**: Live counters for total registered users, approved businesses, active offers, and customer inquiries.
* **Merchant Verification**: Review and approve/reject business profiles or verify authentic merchants.
* **Moderation Controls**: Remove inappropriate offers, manage user roles, and monitor inquiries.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, React Router v6, Lucide Icons, Vanilla CSS Design System (Glassmorphic Dark Theme), Axios
* **Backend**: Node.js, Express.js, REST API, JSON Web Tokens (JWT), Bcrypt.js, Morgan dev logger
* **Database**: MongoDB with Mongoose ODM (Schemas: User, Business, Offer, Enquiry, SavedOffer, Review)

---

## 📂 Project Structure

```text
Locora/
├── client/                      # React Frontend Client (Vite)
│   ├── src/
│   │   ├── components/          # Navbar, Footer, Cards, Filters, ProtectedRoute, Toast
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Home, Login, Register, Offers, Businesses, Profile
│   │   │   ├── customer/        # CustomerDashboard, SavedOffers, Enquiries
│   │   │   ├── business/        # BusinessDashboard, MyBusiness, CreateOffer, EditOffer, Analytics
│   │   │   └── admin/           # AdminDashboard, Users, Businesses, Offers, Reports
│   │   ├── services/            # API Clients (auth, business, offer, enquiry, review)
│   │   └── index.css            # Custom Design Tokens & Glassmorphic Utilities
│   └── package.json
│
├── server/                      # Express.js REST API Backend
│   ├── config/                  # MongoDB Connection
│   ├── controllers/             # Auth, Business, Offer, Enquiry, User, Analytics, Review
│   ├── middleware/              # JWT Auth, Role Authorization, Central Error Handler
│   ├── models/                  # User, Business, Offer, Enquiry, SavedOffer, Review
│   ├── routes/                  # API Route Definitions
│   ├── seed/                    # Seed Script (seedData.js)
│   ├── .env                     # Backend Environment Variables
│   ├── server.js                # Server Entry Point
│   └── package.json
│
├── run.bat                      # 1-Click Windows Fullstack Startup Script
├── package.json                 # Root Project Scripts
└── README.md                    # Platform Documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### Installation & Setup

1. **Clone or Navigate to the Workspace**:
   ```bash
   cd d:\Locora
   ```

2. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd server && npm install

   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Configure Environment Variables**:
   In `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/local_business_db
   JWT_SECRET=super_secret_jwt_key_local_business_promotion_2026
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

4. **Seed Realistic Dummy Data**:
   Populates 9 Users, 10 Businesses, 20+ Offers, 15 Enquiries, and Reviews:
   ```bash
   cd d:\Locora\server
   npm run seed
   ```

---

### Running the Application

#### Option A: 1-Click Automatic Run (Windows)
Double-click `run.bat` or run:
```cmd
.\run.bat
```
*(Starts both backend and frontend servers and launches your browser to [http://localhost:5173](http://localhost:5173))*

#### Option B: Manual Execution
* **Backend Server**:
  ```bash
  cd d:\Locora\server
  npm run dev
  ```
  *(Runs on `http://localhost:5000`)*

* **Frontend Client**:
  ```bash
  cd d:\Locora\client
  npm run dev
  ```
  *(Runs on `http://localhost:5173`)*

---

## 🔑 Demo Development Credentials

All demo accounts use the password: `Password123`

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer** | Rahul Kumar | `rahul@example.com` | `Password123` |
| **Business Owner** | Vamsi Krishna (Fresh Bite Cafe) | `vamsi.business@example.com` | `Password123` |
| **Business Owner** | Anjali Reddy (Urban Threads) | `anjali.business@example.com` | `Password123` |
| **Business Owner** | Rohit Kumar (TechZone Mobiles) | `rohit.business@example.com` | `Password123` |
| **Admin** | Admin User | `admin@example.com` | `Password123` |

> ⚡ *Tip: Click the one-click demo buttons directly on the Login page to instantly fill credentials.*

---

## 📡 Core API Reference

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a customer or business owner
* `POST /api/auth/login` — Sign in and obtain JWT
* `GET /api/auth/me` — Retrieve current authenticated profile
* `PUT /api/auth/updateprofile` — Update name, phone, avatar, or password

### 🏢 Businesses (`/api/businesses`)
* `GET /api/businesses` — Search and filter businesses (category, city, rating)
* `GET /api/businesses/:id` — Single business profile with active promotions
* `POST /api/businesses` — Create/update authenticated merchant profile
* `GET /api/businesses/my/profile` — Fetch logged-in merchant's business
* `PUT /api/businesses/:id/status` — *(Admin)* Approve/reject/verify business
* `DELETE /api/businesses/:id` — *(Admin)* Delete business and associated deals

### 🏷️ Offers (`/api/offers`)
* `GET /api/offers` — List offers with category, city, and discount filtering
* `GET /api/offers/:id` — Single offer details
* `POST /api/offers` — *(Business)* Create promotional campaign
* `PUT /api/offers/:id` — *(Business)* Update existing offer
* `DELETE /api/offers/:id` — *(Business/Admin)* Delete offer
* `POST /api/offers/:id/save` — *(Customer)* Bookmark/unbookmark offer

### 💬 Enquiries (`/api/enquiries`)
* `POST /api/enquiries` — Send direct message to a merchant
* `GET /api/enquiries/my` — Fetch customer's inquiries
* `GET /api/enquiries/business` — Fetch enquiries received by merchant
* `POST /api/enquiries/:id/reply` — Merchant reply to an enquiry

### ⭐ Reviews (`/api/reviews`)
* `GET /api/businesses/:businessId/reviews` — Get all reviews for a business
* `POST /api/businesses/:businessId/reviews` — Submit 1–5 star customer review
* `DELETE /api/reviews/:id` — Remove review (Author or Admin)
