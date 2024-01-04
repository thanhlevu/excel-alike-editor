# How to run project

0. Open terminal and cd into the project.

1. Get into server repository, then run postgresql database using docker:
   $ cd apps/server
   $ npx prisma migrate dev
   $ docker compose up dev-db -d

2. At apps repository, run client and server apps:
   $ pnpm dev

- Test the app at http://localhost:5173/

- To view database with prisma studio, in server repo:
  $ npx prisma studio

# How to run E2E test in project

$ cd client
$ npx cypress open
