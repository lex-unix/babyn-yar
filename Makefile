include .env

MAIN_PACKAGE_PATH := ./cmd/api
BINARY_NAME := api

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]


# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run/api: run cmd/api application
.PHONY: run/api
run/api:
	@go run ${MAIN_PACKAGE_PATH}

## build: build the application
.PHONY: build
build:
	@go build -o=/tmp/bin/${BINARY_NAME} ${MAIN_PACKAGE_PATH}

## run/live: run the application with reloading on file changes
.PHONY: run/live
run/live:
	@go run github.com/cosmtrek/air@v1.43.0 \
		--build.cmd "make build" --build.bin "/tmp/bin/${BINARY_NAME}" --build.delay "100" \
		--build.include_dir "internal,cmd" \
		--misc.clean_on_exit "true" \

## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	psql ${DATABASE_URL}

## db/migrations/new name=$1: create a new database migration
.PHONY: db/migrations/new
db/migrations/new:
	@echo 'Creating migration files for ${name}'
	migrate create -seq -ext=.sql -dir=./migrations ${name}

## db/migrations/up: apply all up database migrations
.PHONY: db/migrations/up
db/migrations/up: confirm
	@echo 'Running migrations...'
	migrate -path ./migrations -database ${DATABASE_URL} up

# ==================================================================================== #
# PRODUCTION
# ==================================================================================== #

## migrate-up: apply all up database migrations
.PHONY: migrate-up
migrate-up: confirm
	@echo 'Running migrations...'
	docker compose --profile tools run --rm migrate up

.PHONY: build/dbbackup
build/dbbackup:
	@echo "building cmd/dbbackup..."
	GOOS=linux GOARCH=amd64 go build -o=./bin/linux_amd64/dbbackup ./cmd/dbbackup
