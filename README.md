# ✦ Inkwell — Full-Stack Blog App

A modern, real-time blog built with **React + Convex + Clerk Auth**.

## Features
- 📖 Public blog — anyone can read
- ✍️ Auth-gated writing — sign in to create/edit/delete
- 💬 Real-time comments
- ❤️ Likes system
- 🔍 Search posts
- 📂 Category browsing
- 📊 Author dashboard

## Quick Setup

### 1. Start Convex dev server
```bash
npx convex dev
```
Follow prompts to create a project. This auto-sets `VITE_CONVEX_URL` in `.env.local`.

### 2. Set up Clerk
1. Create account at clerk.com
2. Create an app, copy the **Publishable Key**
3. Add to `.env.local`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Connect Clerk → Convex
- In Clerk Dashboard: Create a **JWT Template** named `convex`
- In Convex Dashboard: Settings → Authentication → Add Clerk provider
- Update `convex/auth.config.js` with your Clerk domain

### 4. Run
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

Open http://localhost:5173

## Tech Stack
- React + Vite (JSX)
- Convex (real-time backend)
- Clerk (authentication)
- React Router v6
- CSS Modules
