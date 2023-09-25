package data

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRecordNotFound = errors.New("record not found")
)

type Models struct {
	Victims VictimModel
	Events  EventModel
}

func NewModels(db *pgxpool.Pool) Models {
	return Models{
		Victims: VictimModel{DB: db},
		Events:  EventModel{DB: db},
	}
}
