FROM node:20-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune gov --docker

# Install ALL dependencies and build
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY --from=builder /app/out/full/ .

# Build arguments
ARG API_URL
ENV API_URL=${API_URL}

# Build the project
RUN npx turbo build --filter=gov...

# Install ONLY production dependencies (separate stage)
FROM base AS prod-deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm ci --omit=dev

# Final runtime stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astrojs
USER astrojs

# Copy built application from installer
COPY --from=installer --chown=astrojs:nodejs /app/apps /app/apps
COPY --from=installer --chown=astrojs:nodejs /app/packages /app/packages

# Copy ONLY production node_modules from prod-deps
COPY --from=prod-deps --chown=astrojs:nodejs /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=astrojs:nodejs /app/apps/gov/node_modules /app/apps/gov/node_modules
COPY --from=prod-deps --chown=astrojs:nodejs /app/packages /app/packages

# Copy package.json files (needed for module resolution)
COPY --from=builder --chown=astrojs:nodejs /app/out/json/ .

# Runtime environment variables
ARG API_URL
ENV API_URL=${API_URL}
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD [ "node", "./apps/gov/dist/server/entry.mjs" ]
