FROM node:16 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build


FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV CONFIG=/config/.env
CMD ["yarn", "run", "start:development"]
