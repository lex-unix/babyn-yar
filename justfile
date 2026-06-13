api_dir := "apps/api"
main_package := "./cmd/api"
binary := "api"

help:
    @just --list

[working-directory(api_dir)]
tidy:
    go fmt ./...
    go mod tidy -v

[working-directory(api_dir)]
audit:
    go mod verify
    go vet ./...
    staticcheck -checks=all,-ST1000,-U1000 ./...
    govulncheck ./...

[working-directory(api_dir)]
test:
    go test -v -race -buildvcs ./...

[working-directory(api_dir)]
build:
    go build -o=./bin/{{ binary }} {{ main_package }}

[working-directory(api_dir)]
run: build
    ./bin/{{ binary }}

[working-directory(api_dir)]
dev:
    @air --build.cmd "just build" \
        --build.entrypoint "./bin/{{ binary }}" \
        --build.delay "100" \
        --build.include_dir "internal,cmd" \
        --misc.clean_on_exit "true"

psql:
    @docker compose -f docker-compose.dev.yml exec db psql $DATABASE_URL

docker-up:
    docker compose -f docker-compose.dev.yml up --detach

docker-down:
    docker compose -f docker-compose.dev.yml down

migrations-new name:
    @echo 'Creating migration files for {{ name }}'
    migrate create -seq -ext=.sql -dir=migrations {{ name }}

[confirm("Are you sure you want to apply migration?")]
migrations-up:
    @echo 'Running migrations...'
    migrate -path migrations -database $DATABASE_URL up

[working-directory(api_dir)]
build-backup os="linux" arch="amd64":
    mkdir -p ./bin
    GOOS={{ os }} GOARCH={{ arch }} go build -o ./bin/dbbackup ./cmd/dbbackup

remote-sync user host: build-backup
    ssh {{ user }}@{{ host }} 'mkdir -p /home/{{ user }}/babyn-yar /home/{{ user }}/bin'
    scp docker-compose.yml {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/docker-compose.yml
    scp .env.production {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/.env
    scp -r caddy {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/
    scp {{ api_dir }}/bin/dbbackup {{ user }}@{{ host }}:/home/{{ user }}/bin/dbbackup
    ssh {{ user }}@{{ host }} 'chmod +x /home/{{ user }}/bin/dbbackup'
    ssh {{ user }}@{{ host }} 'sudo ln -sfn /home/{{ user }}/bin/dbbackup /usr/local/bin/dbbackup'

[confirm("Are you sure you want to apply migrations on remote?")]
remote-migrations-up user host:
    rsync -az --delete migrations {{ user }}@{{ host }}:/home/{{ user }}/babyn-yar/
    ssh {{ user }}@{{ host }} "cd /home/{{ user }}/babyn-yar && docker compose --profile tools run --rm migrate up"

db-tunnel user host port="5432":
    -ssh -N -L {{ port }}:127.0.0.1:5432 {{ user }}@{{ host }}
