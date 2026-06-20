# Muhammad Fasih — Portfolio

A clean, bold, editorial portfolio website built with the MERN stack.

**Live:** [cs-fasih.github.io/Protfolio](https://cs-fasih.github.io/Protfolio/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Vanilla CSS |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB (Mongoose) |
| **Design** | AVO editorial style — black/white/red, Poppins font |

## Features

- ✅ **AVO Editorial Design** — Maximum contrast, minimum clutter
- ✅ **Responsive** — Mobile-first, works on all screen sizes
- ✅ **Scroll Animations** — IntersectionObserver-based fade + slide
- ✅ **Counter Animation** — Stats count up on scroll
- ✅ **Diagonal Section Dividers** — CSS clip-path polygons
- ✅ **Contact Form** — Connected to Express API + MongoDB
- ✅ **SEO Optimized** — Meta tags, Open Graph, Twitter Cards

## Quick Start

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
cp .env.example .env
# Update MONGO_URI in .env
npm install
npm start
```

## Project Structure

```
Portfolio/
├── client/           # React frontend (Vite)
│   ├── public/images/  # Hero bg, project images
│   ├── src/
│   │   ├── components/ # Navbar, Hero, About, Works, etc.
│   │   ├── data/       # Projects, services, certifications
│   │   └── hooks/      # useScrollReveal
│   └── index.html
├── server/           # Express backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js
└── README.md
```

## Author

**Muhammad Fasih** — [GitHub](https://github.com/CS-Fasih) · [LinkedIn](https://linkedin.com/in/muhammad-fasih-19f) · [Email](mailto:muhammadfasih146@gmail.com)

---

© 2026 Muhammad Fasih. All rights reserved.
