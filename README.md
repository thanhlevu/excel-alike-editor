# How to run project

- To run client and server apps:
  pnpm dev

## Cmd in /server

- To run postgresql database using docker:
  docker compose up dev-db -d

- When update the database schema:
  npx prisma migrate dev

- To generate new types from new schema:
  npx prisma generate

- To view database with prisma studio:
  npx prisma studio
