package config

import (
	"flag"
)

type Config struct {
	Port int
	Env  string
	DB   struct {
		DSN string
	}
	Storage struct {
		AccountID       string
		AccessKeyID     string
		AccessKeySecret string
		Bucket          string
	}
	SessionStore struct {
		DSN          string
		Secret       string
		MaxIdleConns int
		Password     string
	}
}

func NewConfig() Config {
	var cfg Config

	// app
	flag.IntVar(&cfg.Port, "port", 8000, "API server port")
	flag.StringVar(&cfg.Env, "env", "development", "Environment (development|staging|production)")

	// db
	flag.StringVar(&cfg.DB.DSN, "db-dsn", "", "PostgreSQL DSN")

	// storage
	flag.StringVar(&cfg.Storage.AccountID, "storage-account-id", "", "Storage account ID")
	flag.StringVar(&cfg.Storage.AccessKeyID, "storage-access-key-id", "", "Storage access key ID")
	flag.StringVar(&cfg.Storage.AccessKeySecret, "storage-access-key-secret", "", "Storage access key secret")
	flag.StringVar(&cfg.Storage.Bucket, "storage-bucket", "", "Storage bucket name")

	// redis store
	flag.StringVar(&cfg.SessionStore.DSN, "session-store-dsn", "", "Redis DSN")
	flag.StringVar(&cfg.SessionStore.Secret, "session-store-secret", "", "Session secret")
	flag.IntVar(&cfg.SessionStore.MaxIdleConns, "session-store-max-idle-conns", 10, "Redis max idle connections")
	flag.StringVar(&cfg.SessionStore.Password, "session-store-password", "", "Redis password")

	flag.Parse()

	return cfg
}
