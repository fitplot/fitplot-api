# fitplot-api

## Stack

- Koa 2
- Prisma with PlanetScale
- Zod

## Contribution

### Quickstart

If you have already completed the setup steps below, you can get started with:

```bash
npm run dev
```

## Local Environment Setup

### Node Version

This project uses Votla instead of NVM for managing Node versions. Install Volta on your machine with the steps below.

#### Mac

See [Volta > Getting Started](https://docs.volta.sh/guide/getting-started)

#### Windows

Install Volta with Chocolatey via:

```
choco install volta
```

Note: this should be done in a shell with admin permissions.

### Environment Variables (`.env`)

Make a copy of the `.env.example` file in the project root. Name your local copy `.env.local`. This file will not be checked in. Some values in your `.env.local` may need to be filled in from project secrets.

### Other Tools

#### Prisma CLI

This project interacts with the Planetscale database with the [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli). This CLI is a Node application, and can generally be used with `npx` without needing to globally install it.

Some useful commands:

```bash
# Browse your data
npx prisma studio

# Push the Prisma schema state to the database
npx prisma db push

# Pull the schema from an existing database, updating the Prisma schema
npx prisma db pull
```

:bulb: Notes on `prisma migrate`.

> Making schema changes with `db push`. When you merge a development branch into your production branch, PlanetScale will automatically compare the two schemas and generate its own schema diff. This means that Prisma's `[prisma migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)` workflow, which generates its own history of migration files, is not a natural fit when working with PlanetScale. These migration files may not reflect the actual schema changes run by PlanetScale when the branch is merged.

> Prisma recommends not using prisma migrate when making schema changes with PlanetScale. Instead, we recommend that you use the prisma db push command.

> For an example of how this works, see [How to make schema changes with `db push`](https://www.prisma.io/docs/guides/database/planetscale#how-to-make-schema-changes-with-db-push)

#### Fly.io CLI

This project is deployed on Fly. The [Fly CLI](https://fly.io/docs/flyctl/) is useful from time to time.

Some useful commands:

```bash
# Auth yourself
fly auth login

## Commands to interact with all FitPlot apps
fly apps list

## Commands to interact with this app
# View deployment status
fly status
# Ping this app
fly ping
# List project environment variables and secrets
fly secrets list
# Attach to reatime logs in the cloud
fly logs
```

Note: Releases are handled via ci/cd. This project should not be deployed from your local machine with a `fly deploy` command.

#### Planetscale CLI

This project reads data on Planetscale. The [Planetscale CLI](https://planetscale.com/docs/concepts/planetscale-environment-setup) is used to scale, branch, and interact with the database.

Some useful commands:

```bash
# Auth yourself
pscale auth login

# Database branching
pscale branch list
pscale branch create
pscale branch switch
pscale branch delete
```

## Processes and Procedures

### Database Schema Updates

There are lots of gotchas with using Prisma with Planetscale. Be sure to check out the [Using Prisma with Planetscale](https://www.prisma.io/docs/guides/database/planetscale) guide every time.

### Upgrading Node Version for the project

When upgrading the Node version for the project, the Node version should be pinned to the package with:

```bash
volta pin node@x.x.x
```

:warning: Additionally, the Node version should be updated in the root `Dockerfile`.
