# Full‑stack CRUD Todo (Next.js + Express + MongoDB)

Minimal full‑stack example: **Next.js + TailwindCSS + Axios + TanStack Query** on the frontend, **Express + Mongoose + MongoDB** on the backend.

## Stack

Frontend: Next.js, Tailwind CSS, Axios, @tanstack/react-query v5
Backend: Node.js, Express, Mongoose, MongoDB

## Quick Start

```bash
# backend
cd backend && npm i && npm run dev
# .env: PORT=4000, MONGODB_URI=mongodb://127.0.0.1:27017/crud_demo, CORS_ORIGIN=http://localhost:3000

# frontend
cd frontend && npm i && npm run dev
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000
```

Open: **[http://localhost:3000](http://localhost:3000)** (frontend), API at **[http://localhost:4000](http://localhost:4000)**

## API

- `GET /api/items` – list
- `POST /api/items` – create `{ title }`
- `PATCH /api/items/:id` – partial update `{ title | done }`
- `DELETE /api/items/:id` – delete

## Notes

- Use **`PATCH`** for toggling `done` (partial update). Backend returns updated docs with `{ new: true, runValidators: true }`.
- Client updates cache via React Query (`setQueryData`) or `invalidateQueries`.

## References

- Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
- TailwindCSS: [https://tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs)
- TanStack Query: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- Axios: [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
- Express: [https://expressjs.com/](https://expressjs.com/)
- Mongoose: [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)
