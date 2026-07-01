FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

# Pass VITE vars from GitHub Actions build-args
ARG VITE_API_URL
ARG VITE_GRAPHQL_ENDPOINT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAPHQL_ENDPOINT=$VITE_GRAPHQL_ENDPOINT

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:22-alpine AS runner

RUN corepack enable

WORKDIR /app

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /app/project.inlang /app/project.inlang

RUN pnpm install --prod

EXPOSE 3001
CMD ["node", ".output/server/index.mjs"]