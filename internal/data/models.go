package data

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrIncompleteCopy = errors.New("not all records were added")
)

type Models struct {
	Victims     VictimModel
	Events      EventModel
	Assets      AssetModel
	Users       UserModel
	Permissions PermissionModel
	Testimonies VictimTestimonyModel
}

func ValidateTestimony(v *validator.Validator, testimony *VictimTestimony) {
	v.Check(testimony.Title != "", "title", "must no be empty")
	v.Check(testimony.Description != "", "description", "must no be empty")
	v.Check(testimony.Content != "", "content", "must no be empty")
	v.Check(testimony.Cover != "", "cover", "must not be empty")
	v.Check(testimony.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(testimony.Lang, "ua", "en"), "lang", "must be either ua or en")
}

func NewModels(db *pgxpool.Pool) Models {
	return Models{
		Victims:     VictimModel{DB: db},
		Events:      EventModel{DB: db},
		Assets:      AssetModel{DB: db},
		Users:       UserModel{DB: db},
		Permissions: PermissionModel{DB: db},
		Testimonies: VictimTestimonyModel{DB: db},
	}
}
