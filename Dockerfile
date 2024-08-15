FROM oven/bun

WORKDIR /bot

COPY package.json .
COPY .env .
COPY . .

RUN bun install

ENV NODE_ENV production
CMD ["bun", "index.ts"]
