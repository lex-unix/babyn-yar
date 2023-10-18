## This is api Dockerfile
FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/api ./cmd/api
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux go build -o=./api ./cmd/api

EXPOSE 8080

CMD [ "./api" ]
