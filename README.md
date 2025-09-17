//current tree



```
sportsbook
├─ .eslintignore
├─ .eslintrc.json
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
│  │  ├─ 20250905115159_notification
│  │  │  └─ migration.sql
│  │  ├─ 20250905130757_updatenotification
│  │  │  └─ migration.sql
│  │  ├─ 20250906173700_add_rating_fields
│  │  │  └─ migration.sql
│  │  ├─ 20250906191718_add_owner_fields
│  │  │  └─ migration.sql
│  │  ├─ 20250908052009_addfield_venue_minmaxpriceph
│  │  │  └─ migration.sql
│  │  ├─ 20250908185846_add_slot_model
│  │  │  └─ migration.sql
│  │  ├─ 20250916070126_update_booking_nd_paymentmodl
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ avatar-img.jpg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ login-img.jpg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ otp-image.jpg
│  ├─ otp-page.jpg
│  ├─ profile.jpg
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
│  │  │  │  ├─ analytics
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ bookings
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ profile
│  │  │  │  ├─ settings
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ venues
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ [venueId]
│  │  │  │        ├─ courts
│  │  │  │        │  ├─ page.tsx
│  │  │  │        │  └─ [courtId]
│  │  │  │        │     └─ slots
│  │  │  │        │        └─ page.tsx
│  │  │  │        └─ page.tsx
│  │  │  └─ player
│  │  │     ├─ bookings
│  │  │     │  └─ page.tsx
│  │  │     ├─ layout.tsx
│  │  │     ├─ page.tsx
│  │  │     ├─ profile
│  │  │     │  └─ page.tsx
│  │  │     └─ venues
│  │  │        ├─ page.tsx
│  │  │        └─ [venueId]
│  │  │           └─ page.tsx
│  │  ├─ (public)
│  │  │  ├─ about
│  │  │  │  └─ page.tsx
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  └─ venues
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ (otp)
│  │  │  │  │  ├─ resend-otp
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ verify-otp
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ forgot-password
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ reset-password
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ signup
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  ├─ dashboard
│  │  │  │  ├─ admin
│  │  │  │  │  └─ venues
│  │  │  │  │     ├─ route.ts
│  │  │  │  │     └─ [id]
│  │  │  │  │        ├─ approve
│  │  │  │  │        │  └─ route.ts
│  │  │  │  │        └─ reject
│  │  │  │  │           └─ route.ts
│  │  │  │  ├─ owner
│  │  │  │  │  ├─ analytics
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ avatar
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ bookings
│  │  │  │  │  │  ├─ route.ts
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ status
│  │  │  │  │  │        └─ route.ts
│  │  │  │  │  ├─ change-password
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ court
│  │  │  │  │  ├─ notifications
│  │  │  │  │  │  ├─ mark-all
│  │  │  │  │  │  │  └─ route.ts
│  │  │  │  │  │  ├─ route.ts
│  │  │  │  │  │  ├─ stream
│  │  │  │  │  │  │  └─ route.ts
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ route.ts
│  │  │  │  │  ├─ profile
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ reports
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ reviews
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ venues
│  │  │  │  │     ├─ route.ts
│  │  │  │  │     └─ [venueId]
│  │  │  │  │        ├─ courts
│  │  │  │  │        │  ├─ route.ts
│  │  │  │  │        │  └─ [courtId]
│  │  │  │  │        │     ├─ route.ts
│  │  │  │  │        │     └─ slots
│  │  │  │  │        │        ├─ route.ts
│  │  │  │  │        │        └─ [slotId]
│  │  │  │  │        │           └─ route.ts
│  │  │  │  │        └─ route.ts
│  │  │  │  └─ player
│  │  │  │     ├─ avatar
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ bookings
│  │  │  │     │  ├─ cleanup
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     ├─ cancel
│  │  │  │     │     │  └─ route.ts
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ change-password
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ court
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ notifications
│  │  │  │     │  ├─ mark-all
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  ├─ stream
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ payments
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ profile
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ recommended-venues
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ review
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ stats
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ venue
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     ├─ review
│  │  │  │     │     │  └─ route.ts
│  │  │  │     │     └─ route.ts
│  │  │  │     └─ venues
│  │  │  │        └─ route.ts
│  │  │  ├─ payments
│  │  │  │  └─ create
│  │  │  │     └─ route.ts
│  │  │  ├─ protected
│  │  │  │  └─ route.ts
│  │  │  ├─ test-db
│  │  │  │  └─ route.ts
│  │  │  ├─ upload
│  │  │  │  ├─ avatar
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ venue
│  │  │  │     └─ route.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe
│  │  │        └─ route.ts
│  │  ├─ booking
│  │  ├─ context
│  │  │  └─ AuthProvider.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ searchvenues
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        └─ page.tsx
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
│  │  ├─ dummyPage
│  │  │  └─ OwnerBookingsPage.tsx
│  │  ├─ layout
│  │  │  ├─ Footer.tsx
│  │  │  └─ Navbar.tsx
│  │  ├─ owner
│  │  │  ├─ CourtForm.tsx
│  │  │  ├─ CourtList.tsx
│  │  │  ├─ SlotManger.tsx
│  │  │  └─ VenueListPage.tsx
│  │  ├─ player
│  │  │  ├─ bookings
│  │  │  │  ├─ BookingCard.tsx
│  │  │  │  ├─ BookingDetailsModal.tsx
│  │  │  │  └─ BookingsList.tsx
│  │  │  ├─ dashboard
│  │  │  │  ├─ BookingsSection.tsx
│  │  │  │  ├─ RecommendedVenues.tsx
│  │  │  │  ├─ StatsSection.tsx
│  │  │  │  └─ WelcomeSection.tsx
│  │  │  ├─ venue-detail
│  │  │  │  ├─ CourtCard.tsx
│  │  │  │  ├─ CourtList.tsx
│  │  │  │  ├─ SlotBookingModal.tsx
│  │  │  │  ├─ VenueAmenities.tsx
│  │  │  │  ├─ VenueDetailHero.tsx
│  │  │  │  ├─ VenuePhotoGallery.tsx
│  │  │  │  └─ VenueReviews.tsx
│  │  │  ├─ VenueCard.tsx
│  │  │  └─ VenueFilters.tsx
│  │  ├─ public
│  │  │  ├─ VenueImageSlider.tsx
│  │  │  └─ venues
│  │  │     ├─ VenueCard.tsx
│  │  │     └─ VenueSearchBox.tsx
│  │  ├─ shared
│  │  └─ ui
│  │     ├─ accordion.tsx
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
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ generated
│  ├─ hooks
│  │  └─ useNotificationsStream.ts
│  └─ lib
│     ├─ api.ts
│     ├─ cloudinary.ts
│     ├─ mailer.ts
│     ├─ prisma.ts
│     ├─ prismaHelper.ts
│     ├─ slugify.ts
│     ├─ stripe.ts
│     ├─ utils.ts
│     └─ validations
│        ├─ auth.ts
│        └─ venue.ts
├─ tsconfig.json
└─ types
   └─ next-auth.d.ts

```



<!-- 
```
sportsbook
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ player
│  └─ bookings
│     └─ routes.ts
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
│  │  ├─ 20250905115159_notification
│  │  │  └─ migration.sql
│  │  ├─ 20250905130757_updatenotification
│  │  │  └─ migration.sql
│  │  ├─ 20250906173700_add_rating_fields
│  │  │  └─ migration.sql
│  │  ├─ 20250906191718_add_owner_fields
│  │  │  └─ migration.sql
│  │  ├─ 20250908052009_addfield_venue_minmaxpriceph
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ avatar-img.jpg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ login-img.jpg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ otp-image.jpg
│  ├─ otp-page.jpg
│  ├─ profile.jpg
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
│  │  ├─ (public)
│  │  │  ├─ about
│  │  │  │  └─ page.tsx
│  │  │  └─ contact
│  │  │     └─ page.tsx
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
│  │  │  │  ├─ admin
│  │  │  │  │  └─ venues
│  │  │  │  │     ├─ route.ts
│  │  │  │  │     └─ [id]
│  │  │  │  │        ├─ approve
│  │  │  │  │        │  └─ route.ts
│  │  │  │  │        └─ reject
│  │  │  │  │           └─ route.ts
│  │  │  │  ├─ owner
│  │  │  │  │  ├─ bookings
│  │  │  │  │  │  ├─ route.ts
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ status
│  │  │  │  │  │        └─ route.ts
│  │  │  │  │  ├─ notifications
│  │  │  │  │  │  ├─ mark-all
│  │  │  │  │  │  │  └─ route.ts
│  │  │  │  │  │  ├─ route.ts
│  │  │  │  │  │  ├─ stream
│  │  │  │  │  │  │  └─ route.ts
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ route.ts
│  │  │  │  │  ├─ profile
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ reports
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ reviews
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ venues
│  │  │  │  │     ├─ route.ts
│  │  │  │  │     └─ [venueId]
│  │  │  │  │        ├─ courts
│  │  │  │  │        │  ├─ route.ts
│  │  │  │  │        │  └─ [courtId]
│  │  │  │  │        │     └─ route.ts
│  │  │  │  │        └─ route.ts
│  │  │  │  └─ player
│  │  │  │     ├─ bookings
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     ├─ cancel
│  │  │  │     │     │  └─ route.ts
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ court
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ notifications
│  │  │  │     │  ├─ mark-all
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  ├─ stream
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     ├─ payments
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ profile
│  │  │  │     │  └─ route.ts
│  │  │  │     ├─ review
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ route.ts
│  │  │  │     └─ venue
│  │  │  │        ├─ route.ts
│  │  │  │        └─ [id]
│  │  │  │           ├─ review
│  │  │  │           │  └─ route.ts
│  │  │  │           └─ route.ts
│  │  │  ├─ protected
│  │  │  │  └─ route.ts
│  │  │  ├─ test-db
│  │  │  │  └─ route.ts
│  │  │  ├─ upload
│  │  │  │  ├─ avatar
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ venue
│  │  │  │     └─ route.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe
│  │  │        └─ route.ts
│  │  ├─ booking
│  │  ├─ context
│  │  │  └─ AuthProvider.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ venues
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        └─ page.tsx
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
│  │  │  └─ Navbar.tsx
│  │  ├─ owner
│  │  │  └─ VenueListPage.tsx
│  │  ├─ player
│  │  ├─ shared
│  │  └─ ui
│  │     ├─ accordion.tsx
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
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ generated
│  ├─ hooks
│  │  └─ useNotificationsStream.ts
│  └─ lib
│     ├─ api.ts
│     ├─ cloudinary.ts
│     ├─ mailer.ts
│     ├─ prisma.ts
│     ├─ prismaHelper.ts
│     ├─ slugify.ts
│     ├─ stripe.ts
│     ├─ utils.ts
│     └─ validations
│        ├─ auth.ts
│        └─ venue.ts
├─ tsconfig.json
└─ types
   └─ next-auth.d.ts

```



<!-- 
```previous project tree



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

``` -->

