# Diploma Web Blog

A monolith full-stack web blog platform created as a diploma project.  
It supports user registration, authentication, post creation, and categorized viewing of blog entries.

---

## 🧰 Tech Stack

### Frontend
- React, React Router
- Vite
- Editor.js

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL

### Auth
- Auth0 (for user authentication and role management)

---

## ⚙️ Getting Started

### Prerequisites

Before running the project, make sure you have the following installed and configured:

- **Node.js** (v18 or higher recommended)
- **npm** (nvm - recommended)
- **PostgreSQL** (with a database created and running)
- **Auth0 account**
    - Create an Application (Single Page App)
    - Configure callback URLs and logout URLs
    - Save your Domain, Client ID, and Client Secret
- **.env files** correctly set up:
    - One for the backend (e.g., `/backend/.env`)
    - One for the frontend (e.g., `/frontend/.env`)


---

## 🔧 Installation

### Backend:
```
cd backend-app
npm install
npx prisma generate
npm run dev
```

### Frontend:
```
cd frontend
npm install
npm run dev
```

---

## ✅ Features

### Core Features
- 🔐 User registration and login via Auth0
- ✍️ Managing posts
- 👀 View blog posts created by other users
- 🗂️ Sort blog posts by categories (News, IT, etc.) and filters (Top-100, Latest, etc.)
- ⭐ Mark blog posts as favorites
- 💬 Add comments under blog posts (Cascading comments)

### Planned or Optional Features
- 👍👎 Like/dislike comments *(feature under consideration)*
- 🛡️ Admin-only ability to delete any post



---

## 📝 TODO

- [x] Set up project structure (frontend + backend)
- [x] Configure Auth0 integration (Express + React)
- [x] Create authorization middleware and route guards
- [x] Create post creation endpoint (backend)
- [x] Connect PostgreSQL and configure Prisma
- [x] Integrate Editor.js into frontend
- [x] Display posts on frontend (list or cards)
- [ ] Link posts to their authors (user identification)
- [x] Implement comments system
- [x] Enable editing and deleting user’s own posts
- [ ] Add admin-only functionality (delete any post)
- [x] Add client-side form validation
- [x] Handle backend errors and show UI feedback



---

## 📄 License

This project is created as part of a diploma thesis and is not licensed for commercial use.


