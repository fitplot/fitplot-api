# nexus-api

## Getting Started

### Node Version

This project uses Votla instead of NVM for managing Node versions. Install Volta on your machine with the steps below.

#### Windows

Install Volta with Chocolatey via:

```
choco install volta
```

Note: this should be done in a shell with admin permissions.

#### Mac

See [Volta > Getting Started](https://docs.volta.sh/guide/getting-started)

### Upgrading Node Version for the project

When upgrading the Node version for the project, the Node version should be pinned to the package with:

```
volta pin node@x.x.x
```

:warning: Additionally, the Node version should be updated in the root `Dockerfile`.

### `.env`

Create a `.env` file at your project root. In this file, add the following secret keys:

```
DATABASE_URL=
```

## Stack

- Koa 2
- Prisma with Mongo
- Zod
