main_package := "./cmd/api"
binary := "api"

help:
    @just --list

tidy:
    go fmt ./...
    go mod tidy -v

audit:
    go mod verify
    go vet ./...
    staticcheck -checks=all,-ST1000,-U1000 ./...
    govulncheck ./...

test:
    go test -v -race -buildvcs ./...

build:
    go build -o=./bin/{{ binary }} {{ main_package }}

run: build
    ./bin/{{ binary }}

dev:
    @air --build.cmd "just build" \
        --build.bin "./bin/{{ binary }}" \
        --build.delay "100" \
        --build.include_dir "internal,cmd" \
        --misc.clean_on_exit "true"

psql:
    @docker compose -f ./docker-compose.dev.yml exec db psql $DATABASE_URL

docker-up:
    docker compose -f ./docker-compose.dev.yml up --detach

docker-down:
    docker compose -f ./docker-compose.dev.yml down

migration-new name:
    @echo 'Creating migration files for {{ name }}'
    migrate create -seq -ext=.sql -dir=./migrations {{ name }}

[confirm("Are you sure you want to apply migration?")]
migration-up:
    @echo 'Running migrations...'
    migrate -path ./migrations -database $DATABASE_URL up
