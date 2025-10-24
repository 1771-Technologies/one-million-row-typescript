![demo](./demo.png)

# One Million Row Demo

A high-performance demo showcasing how to load and interact with over one million
rows of data from an external source using LyteNyte Grid. This example demonstrates
server-side data loading with LyteNyte Grid.

In addition to [LyteNyte Grid](https://www.1771technologies.com/demo), this demo uses:

- **SQLite** – Lightweight, embedded database.
- **[Vite](https://vitejs.dev/)** – Next-generation frontend tooling.
- **[Hono](https://hono.dev/)** – Ultra-lightweight, fast backend framework.

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/1771-Technologies/one-million-row-demo.git
cd one-million-row-demo
git lfs fetch --all
git lfs pull
pnpm install
pnpm run dev
```

This launches:

- A Vite frontend for the UI
- A Hono backend that serves data from `movies.db` to the frontend

### 📊 LyteNyte Grid

This project demonstrates the power of [LyteNyte Grid](https://www.1771technologies.com/demo), a lightweight,
high-performance data grid built to handle massive datasets with ease.

Key features include:

- Virtualized rendering for smooth scrolling with millions of rows
- Fast filtering, sorting, and pagination
- Minimal setup with flexible configuration
- Designed for modern UI frameworks like React and Vite

Explore the live demo [here](https://www.1771technologies.com/demo).

### About the Implementation

LyteNyte Grid handles the client-side half of the server-loading process.
The server is responsible for handling data requests and implementing any required functionality.
In this demo, the backend logic lives in the \`server\` folder.

In fewer than 300 lines of code, the server efficiently serves over one million rows,
with full support for grouping, aggregation, and filtering.

SQLite is used for simplicity, allowing the database to live alongside the server code.
In production, you might use a more powerful database like ClickHouse, which offers extensive aggregation capabilities.

For more guidance on server data loading, see the
[LyteNyte Grid server loading documentation](https://www.1771technologies.com/docs/server-data-loading-overview).
