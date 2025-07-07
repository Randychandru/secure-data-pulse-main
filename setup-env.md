# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

## Backend Environment Variables (Render)

Set these in your Render backend service:

### Required:
- `FIREBASE_SERVICE_ACCOUNT` - Your Firebase service account JSON
- `ALLOWED_ORIGINS` - Comma-separated list of frontend URLs (e.g., `https://your-frontend-url.onrender.com,http://localhost:3000`)

### Optional:

- `PORT` - Automatically set by Render

## Frontend Environment Variables (Render)

Set these in your Render frontend service:

- `VITE_BACKEND_URL` - Your backend URL (e.g., `https://your-backend-url.onrender.com`)

## Development vs Production

- **Development**: Uses localhost URLs
- **Production**: Uses Render URLs from environment variables

## How it works:

1. Frontend reads `VITE_BACKEND_URL` from environment
2. If not set, falls back to `http://localhost:5000` for development
3. Backend reads `ALLOWED_ORIGINS` from environment
4. If not set, allows localhost for development

This makes your app work in both development and production without code changes! 