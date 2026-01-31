# URL Shortener – Session Based Authentication

A backend URL shortener application built with Node.js, Express, and MongoDB,
using **stateful session-based authentication** with cookies.

This version demonstrates traditional server-side session management and is
useful for understanding how authentication works without tokens.

---

## Features

- Shorten long URLs into unique short links
- Redirect short URLs to original URLs
- Track visit history (basic analytics)
- Session-based authentication using cookies
- Protected routes using middleware
- MongoDB as primary database

---

## Authentication Strategy

This version uses **stateful authentication**:
- A session ID is generated on login
- The session ID is stored in a cookie
- Server maintains user-session mapping
- Middleware validates session before allowing access

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Cookie-parser

---


## Project Structure

├── controllers
├── routes
├── models
├── middlewares
├── views
├── index.js
└── connect.js


---

## How to Run Locally

### Start Redis
```bash
redis-server

```bash
npm install
npm start