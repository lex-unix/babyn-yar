package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lex-unix/babyn-yar/internal/config"
	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/storage"
	"gopkg.in/boj/redistore.v1"
)

const (
	version     = "1.0.0"
	sessionName = "user-session"
)

type application struct {
	config       config.Config
	models       data.Models
	storage      *storage.S3Handler
	sessionStore *redistore.RediStore
}

func main() {
	cfg := config.NewConfig()

	db, err := openDB(cfg)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	log.Println("database connection pool established")

	store, err := newSessionStore(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer store.Close()

	log.Println("redis store initialized")

	storageHandler, err := storage.NewS3Handler(cfg)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("storage handler initialized")

	app := &application{
		config:       cfg,
		models:       data.NewModels(db),
		storage:      storageHandler,
		sessionStore: store,
	}

	err = app.serve()
	if err != nil {
		log.Fatal(err)
	}
}

func openDB(cfg config.Config) (*pgxpool.Pool, error) {
	db, err := pgxpool.New(context.Background(), cfg.DB.DSN)
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.Ping(ctx)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func newSessionStore(cfg config.Config) (*redistore.RediStore, error) {
	store, err := redistore.NewRediStore(
		cfg.SessionStore.MaxIdleConns,
		"tcp",
		cfg.SessionStore.DSN,
		cfg.SessionStore.Password,
		[]byte(cfg.SessionStore.Secret))
	if err != nil {
		log.Fatal(err)
	}

	store.Options.Secure = cfg.Env != "development"
	store.Options.SameSite = http.SameSiteLaxMode
	store.Options.HttpOnly = true

	return store, nil
}
