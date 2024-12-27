FROM golang:latest AS builder

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

EXPOSE 8000

ENTRYPOINT [ "./api" ]
