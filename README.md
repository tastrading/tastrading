# TAS Trading Corporation Website

<div align="center">
  <img src="public/logo.png" alt="TAS Trading Corporation" width="150">
  
  **Industrial Tools & Equipment Supplier Since 1968**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🚀 Features

- **Product Catalog** - Browse products by brand, category, or search
- **Quote Requests** - Request quotes with email notifications
- **Contact Form** - Direct inquiries with auto-reply emails
- **Office Locator** - Find nearest branch with distance calculation
- **WhatsApp Integration** - Quick contact via WhatsApp
- **SEO Optimized** - Full OpenGraph, sitemap, structured data
- **Responsive Design** - Works on all devices

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Prisma 7 | Database ORM |
| PostgreSQL | Database (Neon) |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Nodemailer | Email notifications |

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Gmail account for emails

### Installation

```bash
# Clone repository
git clone <repository-url>
cd tastrading

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Email (Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"
ADMIN_EMAIL="admin@example.com"

# Site URL
NEXT_PUBLIC_SITE_URL="https://tastrading.com"

# Google Verification (optional)
GOOGLE_SITE_VERIFICATION="your-verification-code"
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form handler
│   │   ├── quote-request/ # Quote request handler
│   │   └── search/        # Universal search
│   ├── brands/            # Brand pages
│   ├── categories/        # Category pages
│   ├── products/          # Product pages
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── NearestBranchBar/  # Location-aware top bar
│   ├── ProductCard.tsx    # Product display card
│   ├── QuoteRequestModal/ # Quote form modal
│   └── UniversalSearch/   # Search modal
├── lib/                   # Utilities
│   ├── prisma.ts          # Database client
│   ├── seo.ts             # SEO configuration
│   ├── offices.ts         # Office locations & helpers
│   └── email-templates.ts # HTML email templates
└── prisma/
    └── schema.prisma      # Database schema
```

## 🔧 Key Features

### SEO & Performance
- Dynamic sitemap generation
- OpenGraph & Twitter cards on all pages
- JSON-LD structured data (Organization, LocalBusiness, Product)
- Image optimization with AVIF/WebP
- ISR caching with revalidation

### Email Notifications
- Beautiful HTML email templates
- Admin notifications for inquiries
- Auto-reply to customers
- Quote request confirmations

### Location Features
- Geolocation-based nearest office
- Distance calculation with Haversine formula
- Google Maps integration
- WhatsApp quick contact

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Create a new app password for "Mail"
3. Use the generated password in `GMAIL_APP_PASSWORD`

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Build Commands

```bash
# Production build
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit
```

## 🗄️ Database Schema

```prisma
model Brand {
  id       String    @id @default(cuid())
  name     String
  logo     String?
  products Product[]
}

model Category {
  id       String    @id @default(cuid())
  name     String
  products Product[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal?
  images      ProductImage[]
  brand       Brand?
  category    Category?
  isArchived  Boolean  @default(false)
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String
  createdAt DateTime @default(now())
}
```

## 📞 Contact

**TAS Trading Corporation**
- **Primary Contact**: Moiz Unjhawala - +91 9052772942
- **Head Office**: Secunderabad, Telangana
- **Email**: info@tastrading.com

---

<div align="center">
  <sub>Built with ❤️ by TAS Trading Corporation</sub>
</div>
