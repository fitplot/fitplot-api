# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV=production
ENV CI=true
ENV LEFTHOOK=0

# install open ssl and sqlite3 for prisma
RUN apt-get update && apt-get install -y openssl sqlite3 ca-certificates

# install all node_modules, including dev
FROM base as deps

WORKDIR /app

ADD package.json package-lock.json ./
RUN npm install --include=dev

# setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

# schema doesn't change much so these will stay cached
ADD prisma /app/prisma
RUN npx prisma generate

# build smaller image for running
FROM base

ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA
ENV PORT=3000

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma /app/prisma

ADD . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
