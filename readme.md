# Movie and Series Rating & Streaming Portal

## Project Overview

This project is a **Movie and Series Rating & Streaming Portal** that allows users to explore, rate, and review movies and TV series. Users can also purchase or rent movies/series with integrated payment systems, while admins can manage the media library, moderate user-generated content, and track analytics. The portal prioritizes **performance**, **security**, and an **intuitive user experience**, using modern full-stack technologies.

The application includes features for **user registration**, **authentication**, **content management**, **review management**, **payment integration**, and **streaming**. It provides a seamless user experience across devices and ensures content protection through **DRM** and **watermarking** for self-hosted streams.

---

## Features

### User Features:
- **User Registration & Authentication**: Users can register and log in using email/password.
- **Rating and Reviewing**: Users can rate movies/series on a scale of 1-10 and write reviews.
- **Interaction**: Like/unlike reviews, comment on reviews, and add tags (e.g., spoiler, family-friendly).
- **Purchase and Rent**: Users can purchase or rent movies/series with a time-limited access model for rentals.
- **Watchlist**: Users can save movies/series to their personal watchlist.
- **Review Editing**: Users can edit or delete their own unpublished reviews.

### Admin Features:
- **Media Library Management**: Admins can manage movie/series entries, including metadata like title, genre, cast, and director.
- **Review Moderation**: Admins can approve or unpublish user reviews/comments.
- **Analytics Dashboard**: Admins can view reports on ratings, reviews, sales, and rentals.
- **Sales/Refund Management**: Admins can handle refunds and access revocation for purchases/rentals.

### Payment System Features:
- Integration with popular payment gateways like **Stripe/PayPal/Razorpay**.
- **Purchase Flow**: Users can buy or rent movies/series and receive access links.
- **Payment Confirmation**: Users get a confirmation with access to streaming links.
- **DRM Protection**: Rentals provide time-limited access, and self-hosted streams have watermarking.

---

## Tech Stack

- **Backend**: 
  - Node.js
  - Express.js
  - Prisma ORM (for interacting with PostgreSQL database)
  - JWT Authentication
  - SSL Commerce API for Payment Integration

- **Database**:
  - PostgreSQL (with Prisma ORM)
  
- **Authentication**: 
  - JWT with password hashing (using bcrypt)

---

## Routes

This project follows RESTful API design principles. Below is a list of important routes for both the user and admin functionalities:

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: User login and authentication.

### Movies and Series
- `GET /movies-series`: Get a list of all movies/series.
- `GET /movies-series/:id`: Get details of a specific movie/series.
- `POST /admin/movies-series`: Admin-only route to add new movie/series.
- `PUT /admin/movies-series/:id`: Admin-only route to update movie/series details.

### Reviews
- `POST /reviews/:movieId`: Submit a review for a movie/series.
- `GET /reviews/:movieId`: Get all reviews for a specific movie/series.
- `PATCH /admin/reviews/:reviewId/status`: Admin-only route to approve or unpublish a review.

### Payment System
- `POST /payment/initiate-payment`: Initiate the payment process for buying/renting a movie/series.
- `POST /ssl/success/:id`: Payment success callback.
- `POST /ssl/fail`: Payment failure callback.
- `POST /ssl/cancel`: Payment cancel callback.

---

## Running the Application Locally

To run this project locally, follow these steps:

### Prerequisites:
- Node.js (v16 or later)
- PostgreSQL database
- SSLCommerce credentials for payment integration

### Steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nur-Alam-Limon/movie-portal-backend.git
   cd movie-rating-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following configuration:
   ```
    DATABASE_URL=
    PORT=5000
    JWT_SECRET=
    JWT_REFRESH_SECRET=
    ACCESS_TOKEN_EXPIRES_IN=15m
    REFRESH_TOKEN_EXPIRES_IN=7d
    NODE_ENV=development
    EMAIL_USER=
    EMAIL_PASS=
   ```

4. **Migrate the database** (using Prisma):
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

6. **Access the app**:
   Visit `http://localhost:5000` in your browser.

---

## Important Decisions

### **Why Prisma ORM?**
Prisma is a powerful ORM that simplifies database interactions. It ensures type-safety, easy migrations, and the ability to manage complex relationships, making it a great fit for this project. Prisma’s auto-generated queries and support for PostgreSQL allow rapid development and secure database management.

### **Payment System Integration**
We chose Stripe/PayPal/Razorpay for payment integration based on their widespread use, reliability, and developer-friendly APIs. We ensured **security** and **scalability** by using the best practices for handling payments, including webhook callbacks for payment success/failure, and a **JWT-based authentication** for managing user sessions securely.

### **Modular Architecture**
The backend follows a modular architecture with a separation of concerns between routes, controllers, services, and database models. This structure not only helps with scalability but also ensures that different functionalities (like payment, reviews, and authentication) are isolated and easy to maintain.

---

## Future Improvements

- **User Profiles**: Allow users to have customizable profiles with their rating history, watchlist, and review statistics.
- **Recommendation System**: Implement an intelligent recommendation system based on user ratings and preferences.
- **Advanced Analytics**: Enhance the admin dashboard with deeper insights like most rented movies, most liked reviews, etc.

---





