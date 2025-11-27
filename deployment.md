# Deployment Guide (Render.com)

This guide explains how to deploy the Surfari Ride Sharing System to **Render.com** using Docker.

## Prerequisites
- A GitHub account (where this code is pushed).
- A Render.com account.

## Steps

1.  **Push Code to GitHub**:
    Ensure this entire monorepo is pushed to a GitHub repository.

2.  **Create a New Web Service on Render**:
    -   Go to Dashboard -> New -> Web Service.
    -   Connect your GitHub repository.

3.  **Configure the Service**:
    -   **Name**: `surfari-app` (or similar).
    -   **Runtime**: **Docker** (Render will automatically detect the `Dockerfile` in the root).
    -   **Region**: Choose the one closest to you.
    -   **Branch**: `main` (or your working branch).
    -   **Plan**: Free (for hobby projects).

4.  **Environment Variables**:
    Add the following environment variables in the "Environment" tab:
    -   `JWT_SECRET`: Generate a random strong string (e.g., `super_secure_random_string_123`).
    -   `PORT`: `3000` (Default).

5.  **Persistent Storage (Database)**:
    *Note: The Free plan on Render spins down after inactivity, and the ephemeral file system is wiped on redeploys. For a real app, you should use a managed PostgreSQL database or a Render Disk.*
    
    **For SQLite (Simple/Demo):**
    -   Go to "Disks" tab in your service settings.
    -   **Mount Path**: `/app/data` (You might need to update `db.ts` to point here, or just accept that DB resets on deploy for now).
    -   **Size**: 1GB.

6.  **Deploy**:
    -   Click "Create Web Service".
    -   Render will build the Docker image (this takes a few minutes).
    -   Once done, you will get a URL like `https://surfari-app.onrender.com`.

## Troubleshooting

-   **Build Fails**: Check the logs. Ensure `Dockerfile` paths match your repo structure.
-   **App Crashes**: Check "Logs". Common issues are missing env vars or DB connection errors.

## Option 2: Automatic Deployment (Blueprint) - Recommended

We have included a `render.yaml` file that automates the configuration.

1.  **Push Code to GitHub**.
2.  **Go to Render Dashboard**.
3.  Click **New +** -> **Blueprint**.
4.  Connect your repository.
5.  Render will detect `render.yaml` and show you the plan (Service + Disk).
6.  Click **Apply**.

This will automatically set up the Docker service, generate a secure `JWT_SECRET`, and mount a persistent disk for the database.
