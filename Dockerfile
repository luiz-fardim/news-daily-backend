FROM node:25-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install