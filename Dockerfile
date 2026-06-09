FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

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

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
