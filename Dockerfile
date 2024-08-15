FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY index.ts index.ts
COPY tsconfig.json .
COPY .env .env

ENV NODE_ENV production
CMD ["bun", "index.ts"]

EXPOSE 3060