package data

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

type LegalDocument struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	OccuredOn   time.Time `json:"occuredOn"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Cover       string    `json:"cover"`
	Lang        string    `json:"lang"`
	Version     int32     `json:"version"`
	UserID      int64     `json:"-"`
	User        *User     `json:"user"`
}

type LegalDocumentModel struct {
	DB *pgxpool.Pool
}

func ValidateLegalDocument(v *validator.Validator, document *LegalDocument) {
	v.Check(document.Title != "", "title", "must no be empty")
	v.Check(document.Description != "", "description", "must no be empty")
	v.Check(document.Content != "", "content", "must no be empty")
	v.Check(document.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(document.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(document.Cover != "", "cover", "must not be empty")
	v.Check(!document.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m LegalDocumentModel) Insert(document *LegalDocument) error {
	query := `
		INSERT INTO legal_documents (title, description, content, lang, cover, occured_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		document.Title,
		document.Description,
		document.Content,
		document.Lang,
		document.Cover,
		document.OccuredOn,
		document.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&document.ID, &document.Version)
}

func (m LegalDocumentModel) GetAll(title, lang string, filters Filters) ([]*LegalDocument, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), d.id, d.created_at, d.updated_at, d.title, d.description, d.cover, d.content, d.version, u.full_name
		FROM legal_documents d
		INNER JOIN users u ON d.user_id = u.id
		WHERE (d.lang = $1 OR $1 = '')
		AND (STRPOS(LOWER(title), LOWER($2)) > 0 OR $2 = '')
		ORDER BY %s %s, id ASC
		LIMIT $3 OFFSET $4`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{lang, title, filters.limit(), filters.offset()}

	rows, err := m.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}

	totalRecords := 0
	documents, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*LegalDocument, error) {
		var document LegalDocument
		var user User
		err := row.Scan(
			&totalRecords,
			&document.ID,
			&document.CreatedAt,
			&document.UpdatedAt,
			&document.Title,
			&document.Description,
			&document.Cover,
			&document.Content,
			&document.Version,
			&user.FullName,
		)
		document.User = &user
		return &document, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return documents, metadata, nil
}

func (m LegalDocumentModel) Get(id int64) (*LegalDocument, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT d.id, d.created_at, d.occured_on, d.updated_at, d.title, d.description, d.content, d.lang, d.cover, d.version
		FROM legal_documents d
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var document LegalDocument
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&document.ID,
		&document.CreatedAt,
		&document.OccuredOn,
		&document.UpdatedAt,
		&document.Title,
		&document.Description,
		&document.Content,
		&document.Lang,
		&document.Cover,
		&document.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &document, nil
}

func (m LegalDocumentModel) Update(document *LegalDocument) error {
	query := `
		UPDATE legal_documents
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, occured_on = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		document.Title,
		document.Description,
		document.Content,
		document.Lang,
		document.Cover,
		document.OccuredOn,
		document.ID,
		document.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&document.Version)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return ErrEditConflict
		default:
			return err
		}
	}
	return nil
}

func (m LegalDocumentModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM legal_documents
		WHERE id = ANY($1)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.Exec(ctx, query, ids)
	if err != nil {
		return err
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}
