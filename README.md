# ESTM DocHub

Plateforme Next.js 14 pour consulter, telecharger et partager des ressources academiques de l'ESTM Dakar par filiere, niveau, matiere et type de document.

## Stack

- Next.js 14 App Router, TypeScript, TailwindCSS, composants shadcn/ui locaux
- Prisma ORM + PostgreSQL via Docker
- NextAuth Credentials + JWT
- Upload local dans `uploads/`, avec chunks de 5 Mo
- Zod, TanStack Query, lucide-react, recharts, Vitest + supertest

## Installation

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
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm prisma studio
```

## Variables d'environnement

Voir `.env.example`.

- `DATABASE_URL`: URL PostgreSQL Prisma
- `NEXTAUTH_URL`: URL publique de l'application
- `NEXTAUTH_SECRET`: secret JWT NextAuth
- `UPLOAD_DIR`: dossier de stockage local
- `MAX_UPLOAD_SIZE_MB`: taille maximale d'upload

## Fonctionnalites

- Accueil avec recherche, KPI, filieres, documents recents et messages
- Catalogue filtrable, pagination, favoris, apercu PDF et telechargement trace
- Inscription en statut `PENDING`, connexion bloquee tant que non validee
- Messages communautaires avec limite 500 caracteres et rate-limit
- Admin: dashboard, moderation documents/messages, validation et blocage etudiants, upload chunked

## Captures d'ecran

Lancez `pnpm dev`, puis capturez:

- `/` pour l'accueil
- `/documents` pour le catalogue filtrable
- `/admin` pour le tableau de bord

Le projet est pret pour ajouter de vraies captures dans ce README apres lancement local.
