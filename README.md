# How to run project

0. Open terminal and cd into the project.

- Install pnpm to your machine: $ npm install -g pnpm
- Install dependencies: $ pnpm install

1.  Get into server repository, then run postgresql database using docker:

- $ cd apps/server
- $ docker compose up dev-db -d
- config database connection in /server/.env
- $ npx prisma migrate dev

2.  At apps repository, run client and server apps:

- $ pnpm dev
- Test the app at http://localhost:5173/
- To view database with prisma studio, in server repo:
    - $ npx prisma studio

# How to run E2E test in project

- $ cd client
- $ npx cypress open
- On Cypress window > select E2E testing > select Chrome browser - Start E2E testing on Chrome
- On Chrome window > select `sheet.cy.ts` > click on play button to run all E2E tests (or press `R`)

# API documentation

- Sheet APIs documented with swagger.json in server repo
- To have quick review, please go to https://editor.swagger.io/ , then import the file swagger.json to view all apis and descriptions.
- To test API on Postman, please import file api.postman_collection.json into your Postman app.
