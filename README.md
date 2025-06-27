---
title: One Million Row Demo
description: Load and display 1M+ rows using SQLite, Vite, and LyteNyte Grid.
---

# One Million Row Demo

A high-performance demo that showcases how to load and interact with over 1 million rows of data from an external source using modern tools.

This project uses:

- **[LyteNyte Grid](https://www.1771technologies.com/demo)** – Lightning-fast grid for large data sets.
- **SQLite** – Lightweight, embedded database.
- **[Vite](https://vitejs.dev/)** – Next-generation frontend tooling.
- **[Hono](https://hono.dev/)** – Ultra-lightweight, fast backend framework.

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/1771-Technologies/one-million-row-demo.git
cd one-million-row-demo
pnpm install
pnpm run dev
```

This will launch:

- A Vite frontend for the UI
- A Hono backend that serves data from employee-db.sqlite to the frontend

```
one-million-row-demo/
├── public/               # Static assets
├── src/
│   ├── components/       # UI components
│   ├── lib/              # Utilities
│   └── main.tsx          # App entry
├── server/               # Hono backend
├── employee-db.sqlite    # Database with 1M+ rows
├── vite.config.ts        # Vite config
└── README.mdx
```

### 📊 LyteNyte Grid

This project demonstrates the power of [LyteNyte Grid](https://www.1771technologies.com/demo), a lightweight, high-performance data grid built for handling massive datasets with ease.

Key features include:

- Virtualized rendering for smooth scrolling with millions of rows
- Fast filtering, sorting, and pagination
- Minimal setup with flexible configuration
- Designed for modern UI frameworks like React and Vite

You can explore a live version of the grid [here](https://www.1771technologies.com/demo).
