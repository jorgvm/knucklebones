FROM node:22-alpine AS build

RUN corepack enable

WORKDIR /app

# Copy workspace root files for install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy only the packages needed by the server
COPY packages/shared/ ./packages/shared/
COPY apps/server/ ./apps/server/

# Install dependencies and build
RUN pnpm install --frozen-lockfile --filter @knucklebones/server...
RUN pnpm --filter @knucklebones/server run build

# Runtime stage — only the bundle + prod dependencies
FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile --prod --filter @knucklebones/server...

COPY --from=build /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

CMD ["node", "--max-old-space-size=200", "dist/server.js"]
