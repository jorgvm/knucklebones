FROM node:22-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace root files for install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy only the packages needed by the server
COPY packages/shared/ ./packages/shared/
COPY apps/server/ ./apps/server/

# Install dependencies for the server and its workspace deps
RUN pnpm install --frozen-lockfile --filter @knucklebones/server...

WORKDIR /app/apps/server

CMD ["pnpm", "start"]
