package data

import "github.com/jackc/pgx/v5/pgxpool"

type Models struct {
	Victims VictimModel
}

func NewModels(db *pgxpool.Pool) Models {
	return Models{
		Victims: VictimModel{DB: db},
	}
}
