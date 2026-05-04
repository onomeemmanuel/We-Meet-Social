# We Meet Social

A full-stack social media application built with Node.js, Express, MongoDB, and React.

## Features

- User authentication (signup/login) with JWT
- Create, edit, delete posts (draft/published states)
- Follow/unfollow users
- Like/unlike posts
- View feed of posts from followed users and own posts
- Pagination, search, and sorting for posts
- Responsive React frontend

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React, Vite, Axios
- **Testing**: Jest, Supertest

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (Community Edition)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd we-meet-social
   ```

2. Install dependencies:
   ```bash
   npm install
   cd Client
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `Server/.env.example` to `Server/.env`
   - Update the values as needed:
     - `MONGO_URI` should be your MongoDB connection string
     - For MongoDB Atlas, use the Atlas URI provided by your cluster
     - `JWT_SECRET` should be a strong secret

4. Start MongoDB locally or use Atlas:
   - On Windows: `mongod` (if installed via MSI)
   - Or use MongoDB Atlas (ensure your IP is allowed or use `0.0.0.0/0` for testing)

5. Start the backend:
   ```bash
   npm run dev
   ```

6. Start the frontend (in another terminal):
   ```bash
   cd Client
   npm run dev
   ```

7. Open http://localhost:5174 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get published posts (public)
- `GET /api/posts/:id` - Get single post (public)
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner only)
- `GET /api/posts/user/:userId` - Get user's posts (auth required)

### Follows
- `POST /api/follows` - Follow user (auth required)
- `DELETE /api/follows/:userId` - Unfollow user (auth required)
- `GET /api/follows/following` - Get following list (auth required)
- `GET /api/follows/followers` - Get followers list (auth required)

### Likes
- `POST /api/likes` - Like post (auth required)
- `DELETE /api/likes/:postId` - Unlike post (auth required)

## Testing

1. Ensure MongoDB is running
2. Run tests:
   ```bash
   npm test
   ```

## Deployment

- Backend can be deployed to Heroku, Vercel, or similar
- Frontend can be deployed to Netlify, Vercel
- Database: MongoDB Atlas for production

## License

ISC