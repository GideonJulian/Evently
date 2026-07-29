# Prisma Setup Notes

This file summarizes the Prisma setup completed for the Evently project.

## Project Structure

The project has an Expo client in `client/` and a separate backend workspace in `server/`.

Prisma was configured inside `server/`.

## Files Added

### `server/package.json`

Added a Node package file for the backend so Prisma can be installed and run from the `server` folder.

Scripts added:

```json
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:seed": "tsx prisma/seed.ts"
}
```

Dependencies added:

```json
{
  "@prisma/adapter-pg": "^7.0.0",
  "@prisma/client": "^7.0.0",
  "dotenv": "^17.2.3",
  "pg": "^8.16.3"
}
```

Dev dependencies added:

```json
{
  "@types/pg": "^8.15.6",
  "prisma": "^7.0.0",
  "tsx": "^4.21.0",
  "typescript": "^5.9.3"
}
```

### `server/tsconfig.json`

Added TypeScript config for the backend using `NodeNext` module resolution, strict type checking, and `ES2022` output.

### `server/prisma/seed.ts`

Added a seed script that creates or updates:

- One organizer user
- One starter published event

The seed script uses Prisma's `upsert` API so it can be safely run multiple times without duplicating the starter records.

## Files Updated

### `server/prisma/schema.prisma`

Expanded the Prisma schema from an empty starter schema into an Evently data model.

Added enums:

- `UserRole`
- `EventStatus`
- `TicketStatus`

Added models:

- `User`
- `Event`
- `Ticket`
- `Favorite`

The schema supports:

- Organizers creating events
- Event location, date, time, pricing, status, images, tags, and featured state
- Users buying tickets
- Users favoriting events
- Useful indexes for event category, event date, status, featured events, tickets, and favorites

The schema uses PostgreSQL as the datasource and generates the Prisma client into:

```txt
server/generated/prisma
```

### `server/lib/prisma.ts`

Fixed and modernized the Prisma client helper.

The previous file had:

```ts
import PrismaClient from "@prisma/client";

export const prisma = new PrismaClient();
```

That does not match the generated Prisma 7 client setup used in this project.

It was updated to:

- Load environment variables with `dotenv/config`
- Import `PrismaClient` from the generated client
- Use the PostgreSQL adapter from `@prisma/adapter-pg`
- Read the connection string from `process.env.DATABASE_URL`
- Reuse a singleton Prisma client during development to avoid creating too many connections

### `server/.env`

Fixed the database URL.

Original:

```txt
DATABASE_URL="postgresql://postgres:gideon@77@localhost:5432/evently"
```

Updated:

```txt
DATABASE_URL="postgresql://postgres:gideon%4077@localhost:5432/evently"
```

The `@` inside the password must be URL-encoded as `%40`; otherwise PostgreSQL connection parsing treats it as part of the host separator.

## Commands Run

Installed backend dependencies:

```sh
npm install
```

Generated the Prisma client:

```sh
npm run db:generate
```

Checked TypeScript:

```sh
npx tsc --noEmit
```

Validated the Prisma schema:

```sh
npx prisma validate
```

Pushed the schema to the local PostgreSQL database:

```sh
npm run db:push
```

Seeded the database:

```sh
npm run db:seed
```

## Verification Results

The following checks passed:

- Prisma client generation
- TypeScript validation
- Prisma schema validation
- Database schema push to local PostgreSQL
- Seed script execution

The local PostgreSQL database `evently` is now in sync with the Prisma schema.

## Notes

`npm install` reported 4 dependency vulnerabilities:

- 1 moderate
- 3 high

These were not automatically fixed because `npm audit fix` can change dependency versions beyond the Prisma setup work.

The repository already had many unrelated Git status changes before this documentation file was added. Those unrelated changes were not reverted or modified.
