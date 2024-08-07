package data

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrIncompleteCopy = errors.New("not all records were added")
)

type Models struct {
	Victims            VictimModel
	Events             EventModel
	Assets             AssetModel
	Users              UserModel
	Permissions        PermissionModel
	Testimonies        VictimTestimonyModel
	Books              BookModel
	HolocaustDocuments HolocaustDocumentModel
	MediaArticles      MediaArticleModel
	GalleryImages      GalleryModel
	Partners           PartnerModel
	LegalDocuments     LegalDocumentModel
	DevConcepts        DevConceptModel
}

func NewModels(db *pgxpool.Pool) Models {
	return Models{
		Victims:            VictimModel{DB: db},
		Events:             EventModel{DB: db},
		Assets:             AssetModel{DB: db},
		Users:              UserModel{DB: db},
		Permissions:        PermissionModel{DB: db},
		Testimonies:        VictimTestimonyModel{DB: db},
		Books:              BookModel{DB: db},
		HolocaustDocuments: HolocaustDocumentModel{DB: db},
		MediaArticles:      MediaArticleModel{DB: db},
		GalleryImages:      GalleryModel{DB: db},
		Partners:           PartnerModel{DB: db},
		LegalDocuments:     LegalDocumentModel{DB: db},
		DevConcepts:        DevConceptModel{DB: db},
	}
}
