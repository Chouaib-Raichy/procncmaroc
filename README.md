<div align="center">
  <img src="frontend/public/favicon.png" alt="PRO CNC MAROC Logo" width="80" />
  <h1>PRO CNC MAROC</h1>
  <p><strong>Full-Stack E-Commerce &amp; Customer Management Platform for CNC Machine Sales</strong></p>
  <p>
    <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=flat-square&logo=php" alt="PHP 8.3" />
    <img src="https://img.shields.io/badge/Laravel-13-F93208?style=flat-square&logo=laravel" alt="Laravel 13" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql" alt="MySQL" />
    <img src="https://img.shields.io/badge/JWT-auth-000000?style=flat-square&logo=jsonwebtokens" alt="JWT Auth" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite" />
  </p>
</div>

---

## Overview

**PRO CNC MAROC** is a full-stack web platform for a Moroccan CNC machine dealership. It provides a public-facing storefront to showcase CNC routers, CO2 lasers, and industrial machinery alongside a comprehensive admin dashboard for managing inventory, users, orders, and site content.

The platform features a **multi-step registration flow** requiring admin approval, a **satellite partner map** with Leaflet + ESRI imagery, a **customer gallery** with threaded comments and likes, **visitor tracking** with IP geolocation, a **DTO-based API layer** ensuring consistent API responses, and a **professional admin dashboard** with real-time analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 13 (PHP 8.3) |
| **Frontend** | React 19 + Vite 8 |
| **Database** | MySQL 8 (XAMPP) |
| **Authentication** | JWT (`php-open-source-saver/jwt-auth`) |
| **API Style** | RESTful with DTO layer |
| **SEO** | react-helmet-async, JSON-LD structured data, Open Graph, Twitter Cards |
| **Maps** | Leaflet + ESRI World Imagery (satellite) |
| **Geocoding** | Nominatim (OpenStreetMap) |
| **IP Geolocation** | ip-api.com |
| **Animations** | Framer Motion 12 |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM 7 |
| **Email** | Gmail SMTP with custom HTML templates |

---

## Features

### Public Pages
- **Home** — Hero image, showroom card with 3D perspective tilt, video showcase (auto-play muted), "Why Choose Us" section, responsive layout
- **Our Machines** — Paginated grid (12/page), elastic search + category filter, price display (MAD), technical spec PDF downloads, WhatsApp inquiry
- **Products** — Product listing page
- **About Us** — Dynamic random stats (visitors, orders, completed), premium SVG icons, framer-motion animations
- **Contact Us** — Contact form, Google Map embed, phone/email/location info
- **Customer Gallery** — User-submitted gallery posts (1-5 images), threaded comments, likes (requires login), professional card design with SVG icons, loading skeleton, staggered card entrance, premium carousel with gradient overlays, lightbox
- **Partner Map** — Satellite map with red teardrop pins showing registered business partners (requires login)
- **Machine Detail** — Full specifications, features list, WhatsApp direct inquiry link
- **Public Profile** — Two-column layout with cover photo, avatar, info icons (WhatsApp, Google Maps), gallery carousel, full-screen lightbox
- **Terms of Use** — Professionally designed legal page with staggered fade-in sections, gold accents
- **SEO everywhere** — Every page has unique `<title>`, `<meta description>`, Open Graph, Twitter Cards, and JSON-LD structured data via `react-helmet-async`

### Authentication & User Management
- **JWT-based auth** (login, register, logout)
- **Multi-step registration**: Signup → Complete registration (bio + up to 6 images) → Pending admin approval → Full site access
- **Enterprise name** — Optional field on signup, displayed throughout profile and admin dashboard
- **Password reset** with professional HTML email template (gold/dark themed, personalized greeting)
- **Remember me** (localStorage vs sessionStorage)
- **Form validation**: Live field-level validation, password strength checklist (min 8, uppercase, lowercase, number, symbol), animated error banners, terms of use checkbox
- **International phone input** with flag + dial codes (default +212 Morocco)
- **Forgot password** — Email field is read-only on reset page (pre-filled from URL)

### Dashboard (Admin)
- **Overview** — Real-time analytics dashboard with 7 stat cards (total users, pending, machines, messages, total visits, visits today, unique visitors), SVG icons, staggered framer-motion entrance, colored gradient accents, hover lift effects, and a bar chart for visits per day with hover tooltips
- **Users Manager** — Table with staggered row animations, admin lock icons, check/X status badges, hover row highlight, motion buttons, profile modal with avatar
- **Machines Manager** — CRUD + visibility toggle + soft delete/restore, loading skeleton, row animations, enhanced empty state
- **Categories Manager** — CRUD + soft delete/restore, loading skeleton, gold machine count, row animations
- **Pending Registrations** — Card-based approval/rejection with lightbox image preview, skeleton loading, staggered card entrance, hover lift, motion pagination (10 per page)
- **Messages Manager** — Table with staggered animations, "Read all" with modal (fade + scale), loading skeleton
- **Visitors** — Real visitor tracking with IP, location (city/country), page visited, timestamp, SVG device icons (desktop/mobile/tablet/bot), paginated
- **Sidebar** — Collapsible navigation with active tab highlighting

### User Profile
- **Cover hero** — Avatar, name, role badge, email/phone overlaid on cover image with gradient overlay (LinkedIn-style)
- **Stats bar** — Glassmorphism row with icon-cards for location, member since, business location
- **About + Business Gallery** — Card-based sections with SVG icon headers
- **Settings modals** — Edit Profile and Password & Security open in centered modals with scale/fade animation
- **Image preview modals** — Click avatar or cover to preview, upload, or view full size

### My Gallery (User)
- **Two-column layout** — Add New Post form on left, posts feed on right
- **Professional post cards** — User bar with avatar, premium carousel with gradient overlays/image counter, description clamping with "View more"/"Show less", SVG heart/comment/thumbs-up/delete icons
- **Comments** — Threaded with commenter avatars, animated reply form, Enter-to-submit
- **Likes popover** — Click thumbs-up to see who liked, with avatar/initial avatars
- **Delete with confirmation** — ConfirmModal for safe deletion
- **Loading skeleton** — Shimmer animation while fetching posts
- **Empty state** — SVG illustration with helpful prompt
- **Lightbox** — Full-screen image viewer with close button

### Gallery System
- **Public Customer Gallery** — Paginated (9 posts/page), professional cards with SVG icons, skeleton grid, staggered entrance, premium carousel with gradient overlays and image counter, action bar (heart/comment/thumbs-up), threaded comments, lightbox
- **My Gallery** — User-managed posts at `/my-gallery`, two-column layout (form + posts), professional cards matching public gallery style, likes popover, delete with confirm modal, loading skeleton, empty state

### Visitor Tracking
- `POST /api/track-visit` — Records page URL, IP address, user agent, referrer
- Server-side IP geolocation via ip-api.com (city/country)
- Paginated admin view (50 per page) with SVG device type icons
- Analytics endpoint: `GET /api/admin/stats/summary` — aggregate counts + visits per day

### DTO Layer
Consistent API responses via Data Transfer Objects:
- `MachineDTO`, `CategoryDTO`, `UserDTO`, `GalleryPostDTO`, `GalleryCommentDTO`, `ContactDTO`
- Base `DTO` class with `fromModel()`, `collection()`, `paginated()` helpers
- All API endpoints return typed, URL-resolved data (`image_url`, `pdf_url`)

### SEO
- **Per-page metadata** — Each public route sets unique `<title>`, `<meta description>`, Open Graph, and Twitter Cards via `react-helmet-async`
- **JSON-LD structured data** — Organization schema (logo, contact, address, sameAs social profiles) + WebSite schema with SearchAction for Google Sitelinks
- **Hreflang tags** — `en` and `x-default` on every page for global targeting
- **Sitemap** — `sitemap.xml` with 8 URLs, hreflang alternates, priority/frequency
- **Robots.txt** — Allows all crawlers, points to sitemap
- **Dynamic pages** — Machine detail and public profile set title/description from API data

### Additional Features
- **Soft deletes** on all major entities (machines, categories, gallery, users) with admin restore
- **Toast notifications** (success/error/warning) with auto-dismiss
- **Error boundaries** with Try Again button
- **404 page** for unknown routes
- **Responsive design** with hamburger menu at 900px
- **Dark theme** throughout (black gradient backgrounds, gold `#a37a39` accents)

---

## Prerequisites

- **PHP** >= 8.3
- **Composer** 2.x
- **Node.js** >= 20
- **MySQL** 8 (XAMPP recommended on Windows)
- **PHP Extensions**: BCmath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, PDO MySQL

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Chouaib-Raichy/procncmaroc.git
cd procncmaroc
```

### 2. Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file with database credentials and JWT settings:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=procncmaroc
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-jwt-secret
JWT_TTL=60

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
MAIL_MAILER=log
```

Generate JWT secret and run migrations:

```bash
php artisan jwt:secret
php artisan migrate
php artisan storage:link
```

Create an admin user (run in tinker):

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@procncmaroc.com',
    'password' => bcrypt('password123'),
    'role' => 'admin',
    'is_approved' => true,
]);
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Running the Application

**Start MySQL** (via XAMPP or your preferred method).

**Backend** (port 8000):
```bash
cd backend
php artisan serve
```

**Frontend** (port 3000):
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
procncmaroc/
├── backend/
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/
│   │   │       └── GeocodeUsers.php          # Backfill geolocation for existing users
│   │   ├── DTOs/
│   │   │   ├── DTO.php                       # Abstract base DTO
│   │   │   ├── MachineDTO.php
│   │   │   ├── CategoryDTO.php
│   │   │   ├── UserDTO.php
│   │   │   ├── GalleryPostDTO.php
│   │   │   ├── GalleryCommentDTO.php
│   │   │   └── ContactDTO.php
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php         # Register, login, logout, forgot/reset password
│   │   │   │   └── Api/
│   │   │   │       ├── MachineController.php
│   │   │   │       ├── CategoryController.php
│   │   │   │       ├── ContactController.php
│   │   │   │       ├── GalleryPostController.php
│   │   │   │       ├── GalleryCommentController.php
│   │   │   │       ├── PartnerController.php   # Partner map data
│   │   │   │       ├── ProfileController.php   # User profile + complete registration
│   │   │   │       ├── AdminUserController.php
│   │   │   │       └── StatsController.php     # Visitor tracking + analytics summary
│   │   ├── Notifications/
│   │   │   └── ResetPasswordNotification.php   # Custom HTML email with gold theme
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Machine.php
│   │       ├── Category.php
│   │       ├── Contact.php
│   │       ├── GalleryPost.php
│   │       ├── GalleryComment.php
│   │       ├── GalleryPostLike.php
│   │       ├── GalleryCommentLike.php
│   │       └── PageView.php
│   ├── config/
│   │   ├── auth.php                           # JWT guard configuration
│   │   ├── cors.php                           # CORS for localhost:3000
│   │   └── jwt.php                            # JWT settings
│   ├── database/
│   │   └── migrations/                        # 23 migration files
│   └── routes/
│       └── api.php                            # All API routes
├── frontend/
│   ├── src/
│   │   ├── api/                               # Axios API service modules
│   │   │   ├── axios.js                       # Axios instance + interceptors
│   │   │   ├── machines.js
│   │   │   ├── categories.js
│   │   │   ├── contacts.js
│   │   │   ├── gallery.js
│   │   │   ├── partners.js
│   │   │   ├── users.js
│   │   │   └── visitors.js
│   │   ├── components/                        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── PhoneInput.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── SEO.jsx                       # Per-page meta/OG/JSON-LD via react-helmet-async
│   │   ├── context/
│   │   │   ├── AuthContext.jsx                # Auth state + JWT management
│   │   │   └── ToastContext.jsx               # Global toast notifications
│   │   ├── pages/                             # Route page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── CompleteRegistration.jsx
│   │   │   ├── PendingApproval.jsx
│   │   │   ├── OurMachines.jsx
│   │   │   ├── MachineDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── PartnerMap.jsx
│   │   │   ├── CustomerGallery.jsx
│   │   │   ├── MyGallery.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── PublicProfile.jsx
│   │   │   ├── TermsOfUse.jsx                # Professional terms page with framer-motion
│   │   │   ├── Dashboard.jsx                  # Admin dashboard (single page, 7 tabs)
│   │   │   └── NotFound.jsx
│   │   ├── assets/
│   │   │   ├── whatsapp_icon.svg               # WhatsApp contact icon
│   │   │   └── google_maps_icon.svg            # Google Maps contact icon
│   │   ├── App.jsx                            # Root with routing + auth guards
│   │   └── App.css                            # Global styles
│   ├── public/
│   │   ├── favicon.png
│   │   ├── robots.txt                        # Crawl directives + sitemap link
│   │   ├── sitemap.xml                       # 8 URLs with hreflang
│   │   └── data/                             # Auto-generated city JSON files
│   └── index.html
└── README.md
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/register` | User registration with phone + geocoded business location |
| POST   | `/api/login` | Login with email/password, returns JWT |
| POST   | `/api/forgot-password` | Request password reset (always 200) |
| POST   | `/api/reset-password` | Reset password with token |
| GET    | `/api/machines` | List machines (paginated, filterable) |
| GET    | `/api/machines/{id}` | Single machine details |
| GET    | `/api/categories` | List all categories |
| POST   | `/api/contact` | Submit contact form |
| GET    | `/api/gallery` | Public gallery posts (paginated) |
| GET    | `/api/partners` | Non-admin users with business locations |
| GET    | `/api/partners/{id}` | Single partner profile with post count |
| POST   | `/api/track-visit` | Record a page visit |

### Authenticated (`auth:api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/logout` | Invalidate JWT token |
| GET    | `/api/profile` | Get current user profile |
| POST   | `/api/profile/update` | Update profile (FormData with avatar) |
| POST   | `/api/register/complete` | Upload business images + bio |
| GET    | `/api/gallery/my` | Current user's gallery posts |
| POST   | `/api/gallery` | Create gallery post |
| POST   | `/api/gallery/{id}/update` | Update gallery post |
| DELETE | `/api/gallery/{id}` | Delete gallery post |
| GET    | `/api/gallery/{id}/comments` | Get comments for a post |
| POST   | `/api/gallery/{id}/comments` | Add comment |
| POST   | `/api/gallery/{id}/like` | Toggle post like |
| POST   | `/api/gallery/comments/{id}/reply` | Reply to comment |
| POST   | `/api/gallery/comments/{id}/like` | Toggle comment like |

### Admin (`auth:api` + admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/machines` | All machines (including hidden) |
| GET    | `/api/admin/machines/trashed` | Soft-deleted machines |
| POST   | `/api/admin/machines/{id}/restore` | Restore soft-deleted machine |
| POST   | `/api/admin/machines` | Create machine |
| POST   | `/api/admin/machines/update/{id}` | Update machine |
| DELETE | `/api/admin/machines/{id}` | Soft-delete machine |
| POST   | `/api/admin/categories` | Create category |
| POST   | `/api/admin/categories/update/{id}` | Update category |
| DELETE | `/api/admin/categories/{id}` | Soft-delete category |
| POST   | `/api/admin/categories/{id}/restore` | Restore soft-deleted category |
| GET    | `/api/admin/messages` | Contact form submissions |
| GET    | `/api/admin/visitors` | Visitor tracking data (paginated) |
| GET    | `/api/admin/gallery` | All gallery posts |
| GET    | `/api/admin/gallery/trashed` | Soft-deleted gallery posts |
| POST   | `/api/admin/gallery/{id}/restore` | Restore soft-deleted gallery |
| DELETE | `/api/admin/gallery/{id}` | Force-delete gallery post |
| GET    | `/api/admin/users` | List all users |
| GET    | `/api/admin/users/{id}` | User detail |
| POST   | `/api/admin/users/{id}/toggle-ban` | Ban/unban user |
| POST   | `/api/admin/users/{id}/restore` | Restore soft-deleted user |
| GET    | `/api/admin/users/pending/list` | Pending approval users (paginated, 10/page) |
| POST   | `/api/admin/users/{id}/approve` | Approve user |
| DELETE | `/api/admin/users/{id}/reject` | Reject + force-delete user |
| GET    | `/api/admin/stats/summary` | Analytics overview (counts + visits per day) |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_DATABASE` | MySQL database name | `procncmaroc` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(empty)* |
| `JWT_SECRET` | JWT signing secret | *(generated)* |
| `JWT_TTL` | JWT time-to-live (minutes) | `60` |
| `SESSION_DRIVER` | Session storage driver | `file` |
| `QUEUE_CONNECTION` | Queue driver | `sync` |
| `CACHE_STORE` | Cache driver | `file` |
| `MAIL_MAILER` | Mail driver | `log` (dev) |
| `APP_URL` | Application URL | `http://localhost:8000` |
| `MAIL_MAILER` | Mail driver | `smtp` |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP username | *(Gmail address)* |
| `MAIL_PASSWORD` | SMTP password | *(Gmail App Password)* |
| `MAIL_ENCRYPTION` | SMTP encryption | `tls` |
| `MAIL_FROM_ADDRESS` | Sender email | *(sender address)* |
| `MAIL_FROM_NAME` | Sender name | `PRO CNC MAROC` |

---

## Design Decisions

- **Gold (#a37a39) on black gradient** — Premium luxury feel matching the CNC machinery brand
- **JWT over Sanctum** — Token-based auth better suited for SPA + mobile clients
- **DTO layer** — Ensures consistent API responses with resolved URLs; `collection()` / `paginated()` helpers standardize list outputs
- **Soft deletes** on all entities — Prevents accidental data loss; admin can restore
- **Multi-step approval flow** — Signup → images/bio → admin approval ensures only legitimate businesses gain access
- **Forgot password always returns 200** — Prevents email enumeration attacks
- **ip-api.com for geolocation** — Free, no API key required; falls back gracefully
- **Inline styles with `clamp()`** — Responsive design without excessive media queries
- **Dynamic import for PageTracker** — Visitor tracking doesn't block initial page load
- **Custom HTML email templates** — Full control over branding and layout vs Laravel's default markdown mail
- **Gmail SMTP with App Password** — Secure email sending without third-party mail services
- **Loadable skeletons** — Content-shaped placeholders during data fetch instead of generic spinners
- **SVG icons over emoji** — Consistent rendering across all platforms and browsers
- **Settings in modals** — Edit profile and password forms open in centered popups to keep the profile view clean
- **Cover hero layout** — User identity (avatar, name, role, contact) overlaid on cover photo for a premium social-media-style profile
- **react-helmet-async** — Lightweight per-page SEO without server-side rendering; JSON-LD structured data enables rich search results

---

## Screenshots

> *Coming soon — Add images of the home page, dashboard, partner map, gallery, and admin panel.*

---

## License

This project is proprietary software owned by PRO CNC MAROC.

---

## Contact

- **WhatsApp**: [+212 625 280 991](https://wa.me/212625280991)
- **Phone**: +212 625 280 991 / +212 667 198 564
- **Location**: Shems Al Madina 3 N19 Magasin 1, Tit Mellil, Sidi Hajjaj, Morocco
