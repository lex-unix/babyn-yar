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
        --build.entrypoint "./bin/{{ binary }}" \
        --build.delay "100" \
        --build.include_dir "internal,cmd" \
        --misc.clean_on_exit "true"

psql:
    @docker compose -f {{ justfile_dir() }}/docker-compose.dev.yml exec db psql $DATABASE_URL

docker-up:
    docker compose -f {{ justfile_dir() }}/docker-compose.dev.yml up --detach

docker-down:
    docker compose -f {{ justfile_dir() }}/docker-compose.dev.yml down

migration-new name:
    @echo 'Creating migration files for {{ name }}'
    migrate create -seq -ext=.sql -dir={{ justfile_dir() }}/migrations {{ name }}

[confirm("Are you sure you want to apply migration?")]
migration-up:
    @echo 'Running migrations...'
    migrate -path {{ justfile_dir() }}/migrations -database $DATABASE_URL up

build-backup os="linux" arch="amd64":
    mkdir -p ./bin
    GOOS={{ os }} GOARCH={{ arch }} go build -o ./bin/dbbackup ./cmd/dbbackup

transfer-remote user host: build-backup
    ssh {{ user }}@{{ host }} 'mkdir -p /home/{{ user }}/babyn-yar /home/{{ user }}/bin'
    scp ./docker-compose.yml {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/docker-compose.yml
    scp ./.env.production {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/.env
    scp -r ./caddy {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/
    scp ./bin/dbbackup {{ user }}@{{ host }}:/home/{{ user }}/bin/dbbackup
    ssh {{ user }}@{{ host }} 'chmod +x /home/{{ user }}/bin/dbbackup'
    ssh {{ user }}@{{ host }} 'sudo ln -sfn /home/{{ user }}/bin/dbbackup /usr/local/bin/dbbackup'
