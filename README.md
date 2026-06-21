# Creative Upaay - Movie Ticket Booking App 🎬

A modern, responsive, and robust movie ticket booking web application. This project allows users to browse movies, select theaters and schedules, pick specific seats using an interactive matrix, and simulate a payment and booking flow.

## 🚀 Live Demo & Video
*   **Live App:** `[Insert Vercel/Netlify URL here]`
*   **Video Demo:** `[Insert Loom/YouTube URL here]`

---

## 🛠️ Technology Stack
*   **Frontend:** React (Vite), Tailwind CSS v4, Redux Toolkit (with Persist), React Router
*   **Backend:** Node.js, Express.js, JWT Authentication
*   **Database:** MongoDB
*   **Additional Tools:** `qrcode.react` for digital tickets, `react-hot-toast` for notifications

---

## 🏗️ Architectural Approach

### 1. Advanced Concurrency Control (Atomic Seat Reservation)
To prevent double-booking when multiple users attempt to reserve the same seat simultaneously, I implemented atomic operations using MongoDB's `findOneAndUpdate`. 
- When a user clicks "Pay", the database explicitly verifies that every selected seat is strictly in the `'available'` state before changing it to `'occupied'`. 
- If even one seat has been taken by a concurrent request, the atomic query fails to match, and a `409 Conflict` error is returned gracefully to the user, prompting them to select new seats. 
- *Why:* This achieves concurrency safety directly at the database level, avoiding the overhead of maintaining a separate Redis distributed lock for a standalone instance.

### 2. ACID Properties & Two-Phase Pseudo-Transactions
Since standalone local MongoDB instances do not support multi-document replica-set transactions, I implemented a robust two-phase manual rollback approach to guarantee ACID properties:
1.  **Phase 1:** Atomically reserve seats.
2.  **Phase 2:** Create the Booking document.
3.  **Rollback:** If Phase 2 fails (due to network or validation errors), the system catches the error and immediately issues a rollback query to release the seats reserved in Phase 1 back to the available pool. This prevents "orphan" occupied seats.
The cancellation flow implements the same rollback logic in reverse.

### 3. State Management Logic
The application relies heavily on **Redux Toolkit (RTK)** to manage complex cross-page state smoothly without prop-drilling:
-   **`authSlice`**: Stores the JWT token and user profile.
-   **`bookingSlice`**: Tracks the transient state during the checkout flow (selected movie, theatre, date, time, screen, format, and an array of selected seats).
-   **`bookingsHistorySlice`**: Stores the user's fetched active and past bookings for the "My Bookings" page.

**Persistence:** I used **`redux-persist`** with `localStorage` to ensure the user's session and transient booking data survive page reloads. If a user accidentally refreshes on the Checkout page, their selected seats and totals remain intact.

### 4. UI/UX Aesthetics
*   The application utilizes a mobile-first, app-like layout constrained to a maximum width of `390px` to mirror the Figma designs accurately.
*   The bottom navigation is fixed, and content sections are vertically flexed to ensure CTA buttons are always pinned to the bottom of the viewport.

---

## 💡 Assumptions Made
1.  **Payment Gateway:** Since a real payment integration wasn't required, I built a simulated gateway. It performs strict regex validations on credit card formats (16-digit number, future MM/YY expiry, 3-4 digit CVC). It has an artificial 20% failure rate to demonstrate how the system handles payment rejections and seat rollbacks.
2.  **Theaters & Screenings:** Rather than complex geolocation, I assumed all theaters are available to the user and a single pre-seeded `Screening` document tracks the exact `seatMap` for a specific movie, theater, date, and time.
3.  **Authentication:** Users only have standard roles. No admin dashboard was requested, so managing movies and theater data is done via the database seed script.

---

## 💻 How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB installed locally and running on port `27017`

### 1. Setup Backend
```bash
cd server
npm install

# The .env file should contain:
# MONGODB_URI=mongodb://127.0.0.1:27017/movie-ticket-app
# JWT_SECRET=your_secret_key
# PORT=5000

# Seed the database with initial Movies, Theatres, and Screenings
npm run seed

# Start the server (runs on http://localhost:5000)
npm run dev
```

### 2. Setup Frontend
```bash
# Open a new terminal tab
cd client
npm install

# Start the Vite development server
npm run dev
```
The app will be running at `http://localhost:5173`.

### 3. Demo Credentials
If you wish to bypass the sign-up process, use the seeded demo account:
*   **Email:** `demo@movieapp.com`
*   **Password:** `demo1234`
