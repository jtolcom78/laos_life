# Deployment Guide for Laos Life

This guide provides instructions for deploying the backend (NestJS) to Render and the admin frontend (Next.js) to Vercel/Render.

## Backend (NestJS) - Render Deployment

### Environment Variables
Configure the following environment variables in your Render service settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | The port the app runs on (Render sets this automatically) | `10000` |
| `DATABASE_URL` | Connection string for your PostgreSQL database | `postgresql://user:password@host:port/db` |
| `SUPABASE_URL` | URL of your Supabase project | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | Supabase Anon/Public Key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret!) | `eyJ...` |
| `JWT_SECRET` | Secret key for JWT authentication | `your-secret-key` |

### Build & Start Commands
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

---

## Admin Frontend (Next.js) - Vercel Deployment

### Environment Variables
Configure the following environment variables in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | The URL of your deployed backend | `https://your-backend-service.onrender.com` |

### Build & Start Commands
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (Vercel usually detects this automatically)
- **Install Command:** `npm install`

## General Notes
- Ensure your `DATABASE_URL` matches the connection string provided by Supabase (Transaction mode is recommended for serverless/edge functions, but Session mode is fine for standard persistent servers like Render).
- If using Supabase, ensure "Allow connections from all IP addresses" (0.0.0.0/0) is enabled or add Render's/Vercel's IP ranges to the allowlist.
