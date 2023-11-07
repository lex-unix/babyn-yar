FROM golang:latest as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/api ./cmd/api
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux go build -o=./api ./cmd/api

FROM alpine:latest

RUN apk --no-cache add curl

WORKDIR /app

COPY --from=builder /app/api ./api

ARG DATABASE_URL
ARG API_PORT
ARG STORAGE_ACCOUNT_ID
ARG STORAGE_ACCESS_KEY_ID
ARG STORAGE_SECRET_ACCESS_KEY
ARG STORAGE_BUCKET_NAME
ARG REDIS_URL
ARG SESSION_SECRET
ARG CORS_ORIGINS

ENV DATABASE_URL=$DATABASE_URL \
  API_PORT=$API_PORT \
  STORAGE_ACCOUNT_ID=$STORAGE_ACCOUNT_ID \
  STORAGE_ACCESS_KEY_ID=$STORAGE_ACCESS_KEY_ID \
  STORAGE_SECRET_ACCESS_KEY=$STORAGE_SECRET_ACCESS_KEY \
  STORAGE_BUCKET_NAME=$STORAGE_BUCKET_NAME \
  REDIS_URL=$REDIS_URL \
  SESSION_SECRET=$SESSION_SECRET \
  CORS_ORIGINS=${CORS_ORIGINS}

EXPOSE 8080

ENTRYPOINT ./api \
  -db-dsn=${DATABASE_URL} \
  -port=${API_PORT} \
  -storage-account-id=${STORAGE_ACCOUNT_ID} \
  -storage-access-key-id=${STORAGE_ACCESS_KEY_ID} \
  -storage-access-key-secret=${STORAGE_SECRET_ACCESS_KEY} \
  -storage-bucket=${STORAGE_BUCKET_NAME} \
  -session-store-dsn=${REDIS_URL} \
  -session-store-secret=${SESSION_SECRET} \
  -cors-trusted-origins=${CORS_ORIGINS}
