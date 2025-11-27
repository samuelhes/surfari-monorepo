# Surfari-Style Ride Sharing System

> **Executive Summary**: A full-stack, mobile-first web platform for ride-sharing where drivers publish trips and passengers request seats. Features a "pay-on-accept" model where payments are only triggered upon driver approval. Built with React, Node.js, and SQLite in a unified monorepo.

A responsive web-based ride-sharing platform where drivers publish rides and passengers request seats with a "pay-on-accept" model.

## Features

- **Responsive Web App**: Mobile-first design using React + TailwindCSS.
- **Role-Based**: Switch between Passenger and Driver roles.
- **Ride Management**: Publish, search, and manage rides.
- **Request System**: Passengers request seats; Drivers accept/reject.
- **Pay-on-Accept**: Mock payment integration triggered only upon acceptance.
- **Monorepo**: Unified codebase for Frontend and Backend.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Zustand, Axios.
- **Backend**: Node.js, Express, SQLite.
- **Language**: TypeScript (Frontend & Backend).

## Quick Start (Recommended)

We have provided helper scripts to get you started quickly.

1.  **Setup** (Install dependencies & seed DB):
    ```bash
    ./setup.sh
    ```

2.  **Start** (Run both Frontend & Backend):
    ```bash
    ./start.sh
    ```

## Manual Setup & Running

**Prerequisites**: Node.js and npm.

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database (optional):
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`.

### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## Architecture

See [architecture.md](./architecture.md) for detailed system design.

## API Documentation

See [api-docs.md](./api-docs.md) for API endpoints and schemas.
