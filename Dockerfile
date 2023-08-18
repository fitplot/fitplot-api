# base node image
FROM node:18-bullseye-slim as base

# install open ssl and sqlite3 for prisma
RUN apt-get update && apt-get install -y openssl sqlite3 ca-certificates

# ARG CI
# ENV CI=$CI
ENV LEFTHOOK=0

# install all node_modules, including dev
FROM base as deps

RUN mkdir /app/
WORKDIR /app/

ADD package.json package-lock.json ./
RUN npm install --production=false

# setup production node_modules
FROM base as production-deps

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json /app/
RUN npm prune --production

# build app
FROM base as build

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules

# schema doesn't change much so these will stay cached
ADD prisma /app/prisma

RUN npx prisma generate

# uncomment below if there is a build or transpile step in the future
# # app code changes all the time
# ADD . .
# RUN npm run build

# build smaller image for running
FROM base

ENV NODE_ENV=production

ARG GITHUB_SHA
ENV GITHUB_SHA=$GITHUB_SHA

RUN mkdir /app/
WORKDIR /app/

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma /app/prisma

ADD . .

EXPOSE 3000

ENV PORT 3000

CMD [ "npm", "run", "start" ]
