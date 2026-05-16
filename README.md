# KurdFlight

KurdFlight is a full-stack flight booking prototype built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. It focuses on a complete booking flow: search, results, flight details, quote calculation, booking creation, user auth, and user-specific booking history.

## Features

- Search flights with a polished homepage search flow
- Browse flight results with filters and route map support
- Open a flight deal page and customize fare, bags, and seats
- Get backend-driven quote totals
- Create bookings and persist them to PostgreSQL
- Sign up, sign in, sign out, and keep users authenticated with sessions
- View user-specific bookings in a My Bookings page
- Delete bookings from the UI and database

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- bcryptjs
- Framer Motion
- React Leaflet / Leaflet

## Screenshots

### Homepage
![Homepage](./pics/home%20page.png)

![Homepage Alternate](./pics/home%20page%202.png)

![Homepage Alternate 2](./pics/home%20page%203%20.png)

### Search Results
![Search Results](./pics/search%20flight.png)

![Search Results Alternate](./pics/search%20flight%202.png)

### Deal Details
![View Deal](./pics/view%20deal.png)

![View Deal Alternate](./pics/view%20deal%202.png)

### Booking Confirmation
![Booked Flight](./pics/booked%20flight.png)

### My Bookings
![My Bookings](./pics/my%20bookings.png)

### Sign Up
![Sign Up](./pics/sign%20up.png)

## Core Flows

### Flight Search
- Homepage search routes users to `/flights`
- The flights page fetches search results through backend API routes
- Search supports airport and city-style matching

### Flight Details + Quote
- Users can open a specific deal page from results
- Fare, bag, and seat choices are sent to the backend quote endpoint
- Pricing summary is driven by backend calculation rather than frontend-only math

### Booking Creation
- Bookings are created through API routes
- Data is saved to PostgreSQL with Prisma
- Each booking belongs to a signed-in user

### Auth
- Users can sign up and sign in
- Passwords are hashed with `bcryptjs`
- Session tokens are stored in the database and set in HTTP-only cookies
- Protected flows use the current authenticated user

## Project Structure

```text
app/
  api/
    auth/
    booking/
    bookings/
    flights/
  flights/
  my-bookings/
  sign-in/
  sign-up/
components/
  auth/
  flights/
  home/
  search/
lib/
  auth.ts
  prisma.ts
  mock-*.ts
prisma/
  schema.prisma
```

## Database Models

Current Prisma models include:

- `User`
- `Session`
- `Booking`

Bookings are linked to users, and sessions are linked to users for cookie-based auth.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Current Status

This project is a strong full-stack prototype with:

- real database-backed bookings
- real user auth sessions
- protected user booking history
- backend-driven booking quotes

Future improvements could include:

- profile/settings pages
- booking update/cancel flows
- stronger route protection
- email verification / password reset
- full production cleanup and type hardening

## Author

Built as a learning-focused full-stack flight booking project.
