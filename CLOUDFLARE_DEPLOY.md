# Deploy to Cloudflare Workers

## Prerequisites
1. [Node.js](https://nodejs.org/) installed
2. [Cloudflare account](https://dash.cloudflare.com/)
3. [MongoDB Atlas account](https://www.mongodb.com/atlas/database) with Data API enabled

## Setup MongoDB Atlas Data API

1. Go to MongoDB Atlas → Your Cluster → Data API tab
2. Enable the Data API
3. Copy the Data API URL (format: `https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1`)
4. Create an API Key and copy it

## Configure Environment Variables

Edit `wrangler.toml`:

```toml
[vars]
MONGODB_URI = "https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1"
MONGODB_API_KEY = "your-mongodb-api-key"
JWT_SECRET = "your-secret-key"
```

## Deploy

```bash
# Install dependencies
npm install

# Build frontend and deploy
npm run deploy

# Or for development preview
npm run dev:worker
```

## Important Notes

- Cloudflare Workers don't support Node.js/Express natively
- This app uses **Hono** framework (Cloudflare-native)
- MongoDB is accessed via **Atlas Data API** (REST), not mongoose
- Frontend must be built before deployment (goes to `/build` folder)

## MongoDB Collections Required

Create these collections in your MongoDB Atlas database (`gofood`):
- `users` - User accounts
- `orders` - Orders with delivery scheduling
- `food_items` - Food menu items
- `foodCategory` - Food categories
- `admins` - Admin users
