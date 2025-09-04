
```
sportsbook
├─ .qodo
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20250902074817_init
│  │  │  └─ migration.sql
│  │  ├─ 20250902185723_add_unique_to_email
│  │  │  └─ migration.sql
│  │  ├─ 20250902203757_add_password_reset_model
│  │  │  └─ migration.sql
│  │  ├─ 20250903043029_update_from_office
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ avatar-img.jpg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ login-img.jpg
│  ├─ next.svg
│  ├─ otp-image.jpg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ forgot-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ reset-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx
│  │  │  └─ verify
│  │  │     └─ page.tsx
│  │  ├─ (dashboard)
│  │  │  ├─ admin
│  │  │  │  └─ page.tsx
│  │  │  ├─ owner
│  │  │  │  ├─ bookings
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ profile
│  │  │  │  └─ venues
│  │  │  │     └─ page.tsx
│  │  │  └─ player
│  │  │     ├─ bookings
│  │  │     ├─ page.tsx
│  │  │     └─ profile
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ (otp)
│  │  │  │  │  ├─ resend-otp
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ verify-otp
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ forgot-password
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ reset-pssword
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ signup
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  ├─ dashboard
│  │  │  │  └─ owner
│  │  │  │     ├─ bookings
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ route.ts
│  │  │  │     └─ venues
│  │  │  │        ├─ route.ts
│  │  │  │        └─ [id]
│  │  │  │           └─ route.ts
│  │  │  ├─ protected
│  │  │  │  └─ route.ts
│  │  │  ├─ test-db
│  │  │  │  └─ route.ts
│  │  │  └─ upload
│  │  │     ├─ avatar
│  │  │     │  └─ route.ts
│  │  │     └─ venue
│  │  │        └─ route.ts
│  │  ├─ booking
│  │  ├─ context
│  │  │  └─ AuthProvider.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ venues
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ login-form.tsx
│  │  │  └─ signup-form.tsx
│  │  ├─ booking
│  │  ├─ dashboard
│  │  │  └─ layout
│  │  │     ├─ DashboardLayout.tsx
│  │  │     ├─ LogoutButton.tsx
│  │  │     ├─ ProtectedRoute.tsx
│  │  │     └─ Sidebar.tsx
│  │  ├─ layout
│  │  ├─ owner
│  │  │  └─ VenueListPage.tsx
│  │  ├─ player
│  │  ├─ shared
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ generated
│  └─ lib
│     ├─ cloudinary.ts
│     ├─ mailer.ts
│     ├─ prisma.ts
│     ├─ slugify.ts
│     ├─ utils.ts
│     └─ validations
│        ├─ auth.ts
│        └─ venue.ts
├─ tsconfig.json
└─ types
   └─ next-auth.d.ts

```