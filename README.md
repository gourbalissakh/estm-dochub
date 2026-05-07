# ESTM DocHub

Plateforme Next.js 14 pour consulter, telecharger et partager des ressources academiques de l'ESTM Dakar par filiere, niveau, matiere et type de document.

Application creee par l'Amicale des etudiants Tchadiens a l'ESTM 2026.
Developpee par @Gourbal2026.

## Stack

- Next.js 14 App Router, TypeScript
- TailwindCSS v4 + design system custom (variables CSS, glassmorphism, gradients)
- Composants shadcn/ui locaux + Radix Primitives
- Prisma ORM + PostgreSQL
- NextAuth Credentials + JWT
- Stockage cloud Vercel Blob en production, local en dev
- Zod, TanStack Query, lucide-react, recharts, Vitest + Playwright

## Installation locale

```bash
cp .env.example .env
docker compose up -d
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Comptes de test

- Admin: `admin@estm.sn` / `Admin123!`
- Etudiants valides: `etudiant1@estm.sn` a `etudiant4@estm.sn` / `Student123!`
- Etudiant en attente: `etudiant5@estm.sn` / `Student123!`

## Scripts

```bash
pnpm dev         # serveur de dev
pnpm build       # build production (prisma generate inclus)
pnpm start       # demarrer le build production
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest
pnpm test:e2e    # playwright
pnpm prisma studio
```

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL Postgres Prisma | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | URL publique | `https://votre-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret JWT (>= 32 chars) | `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob | `vercel_blob_rw_...` |
| `UPLOAD_DIR` | Stockage local (dev) | `./uploads` |
| `MAX_UPLOAD_SIZE_MB` | Taille max upload | `500` |

## Hebergement gratuit (Vercel + Neon)

### 1. Base de donnees Postgres (Neon - gratuit)

1. Creer un compte sur [neon.tech](https://neon.tech)
2. Creer un projet `estm-dochub` (region la plus proche : Frankfurt)
3. Copier la `DATABASE_URL` (avec `?sslmode=require`)

### 2. Stockage de fichiers (Vercel Blob - gratuit)

1. Sur [vercel.com](https://vercel.com), Storage → Create Database → Blob
2. Copier le `BLOB_READ_WRITE_TOKEN`

### 3. Deploiement Vercel

**Option A — depuis GitHub (recommande)**

1. Push le repo sur GitHub
2. Sur [vercel.com/new](https://vercel.com/new), importer le repo
3. Framework : Next.js detecte automatiquement
4. Renseigner les variables d'environnement (cf tableau ci-dessus)
5. Deploy

**Option B — depuis le CLI**

```bash
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL
npx vercel env add NEXTAUTH_URL
npx vercel env add NEXTAUTH_SECRET
npx vercel env add BLOB_READ_WRITE_TOKEN
npx vercel deploy --prod
```

### 4. Initialiser la base en production

Une fois deploye, lancer le seed contre la prod (depuis ta machine, en exposant temporairement `DATABASE_URL` de prod) :

```bash
DATABASE_URL="<URL_NEON>" pnpm prisma migrate deploy
DATABASE_URL="<URL_NEON>" pnpm prisma db seed
```

L'app est en ligne. Connectez-vous avec `admin@estm.sn` / `Admin123!`.

### Notes

- Le stockage local `uploads/` n'est pas disponible sur Vercel serverless. L'app utilise automatiquement Vercel Blob quand `BLOB_READ_WRITE_TOKEN` est present.
- `prisma generate` est lance automatiquement via `postinstall`.
- Le fichier `vercel.json` configure la region `fra1` (Paris/Frankfurt) pour optimiser la latence depuis l'Afrique de l'Ouest.

## Fonctionnalites

- Accueil avec recherche, KPIs animes, filieres, documents recents et messages
- Catalogue filtrable, pagination, favoris, apercu PDF et telechargement trace
- Inscription en statut `PENDING`, connexion bloquee tant que non validee
- Messages communautaires avec limite 500 caracteres et rate-limit
- Admin: dashboard, moderation documents/messages, validation et blocage etudiants, upload chunked
- Mode sombre persistant, design glassmorphism + gradients

## Captures d'ecran

Lancez `pnpm dev`, puis capturez:

- `/` pour l'accueil
- `/documents` pour le catalogue filtrable
- `/admin` pour le tableau de bord
