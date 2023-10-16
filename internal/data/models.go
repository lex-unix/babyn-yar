package data

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
)

type Models struct {
	Victims     VictimModel
	Events      EventModel
	Assets      AssetModel
	Users       UserModel
	Permissions PermissionModel
}

func NewModels(db *pgxpool.Pool) Models {
	return Models{
		Victims:     VictimModel{DB: db},
		Events:      EventModel{DB: db},
		Assets:      AssetModel{DB: db},
		Users:       UserModel{DB: db},
		Permissions: PermissionModel{DB: db},
	}
}
