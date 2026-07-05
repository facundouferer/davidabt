# AGENTS.md

Single-package Next.js 16 app (App Router) serving as the public portfolio + admin CMS for sculptor David Abt. Spanish-facing content (`es_AR`), admin at `/admin`.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — runs `prisma generate` then `next build` (do not skip the generate step)
- `npm run lint` — ESLint flat config (`eslint.config.mjs`); lint a single file with `npx eslint <path>`
- No `test` or `typecheck` scripts. TypeScript errors surface only via `next build`; run `npx tsc --noEmit` manually if you need a standalone check.
- `npm install` auto-runs `prisma generate` (postinstall). If you edit `prisma/schema.prisma`, re-run `npx prisma generate`.

## Database / Prisma

- Prisma 5 + PostgreSQL (Neon). Datasource URL comes from `DATABASE_URL`.
- Schema is the source of truth for the 4 models: `User`, `Obra`, `Evento`, `Curriculum`. `Obra.seccion` enumerates the public site sections (`formas-volumenes`, `cosmos`, `pinturas`, `onagua`, `trabajos-especiales`, `procesos`).
- Seed is NOT an npm script: run `node prisma/seed.js` to (re)create the `admin`/`admin` user. There is no `db:seed` script — invoking `prisma db seed` without `prisma.seed` configured will fail.
- Client is imported from `@/lib/prisma` (singleton pinned on `globalThis` in dev). Import the client there, never instantiate `PrismaClient` directly.

## Auth

- NextAuth v4 (Credentials provider) at `/api/auth/[...nextauth]/route.ts`. JWT strategy; `role` is propagated through `jwt`/`session` callbacks and typed in `types/next-auth.d.ts`.
- There is NO middleware. Admin route protection is enforced per-page via `getServerSession` — when adding admin pages, guard them explicitly; relying on the `/admin` layout SessionProvider alone is not sufficient.
- Seed admin credentials: `admin` / `admin` (dev only). Change in production.

## Required env vars

`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` (Vercel Blob for image uploads). See `VERCEL_ENV_SETUP.md`.

## Uploads

Images go to Vercel Blob (`@vercel/blob`) via `/api/upload`. Remote images are allowed only from `*.public.blob.vercel-storage.com` (configured in `next.config.ts`). Update that pattern if you add another image host.

## Styling

Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config.js`). Theme tokens live in `app/globals.css` under `@theme inline`.

## Conventions

- Path alias: `@/*` → repo root (see `tsconfig.json` `paths`).
- Rich text uses TipTap (`@tiptap/*`); editors in `app/components/RichTextEditor*.tsx`. `Curriculum.contenido` and `Evento.descripcion` store rendered HTML.
- PDF export of catalogs uses `jspdf` + `html2canvas` (see `app/components/CatalogDownload.tsx`).
- `app/components/` holds shared client components; route-specific pages live under their own `app/<section>/` directories.
- Repo includes Spanish docs (`SEO_OPTIMIZATION.md`, `VERCEL_ENV_SETUP.md`) — prefer extending existing docs over creating new ones.

## Deploy

Vercel. `postinstall` generates the Prisma client; confirm `DATABASE_URL` is reachable at build time or the build fails.