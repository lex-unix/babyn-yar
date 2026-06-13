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

type DevConcept struct {
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

type DevConceptModel struct {
	DB *pgxpool.Pool
}

func ValidateDevConcept(v *validator.Validator, concept *DevConcept) {
	v.Check(concept.Title != "", "title", "must no be empty")
	v.Check(concept.Description != "", "description", "must no be empty")
	v.Check(concept.Content != "", "content", "must no be empty")
	v.Check(concept.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(concept.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(concept.Cover != "", "cover", "must not be empty")
	v.Check(!concept.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m DevConceptModel) Insert(concept *DevConcept) error {
	query := `
		INSERT INTO development_concepts (title, description, content, lang, cover, occured_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		concept.Title,
		concept.Description,
		concept.Content,
		concept.Lang,
		concept.Cover,
		concept.OccuredOn,
		concept.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&concept.ID, &concept.Version)
}

func (m DevConceptModel) GetAll(title, lang string, filters Filters) ([]*DevConcept, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), c.id, c.created_at, c.updated_at, c.title, c.description, c.cover, c.content, c.version, u.full_name
		FROM development_concepts c
		INNER JOIN users u ON c.user_id = u.id
		WHERE (c.lang = $1 OR $1 = '')
		AND (STRPOS(LOWER(c.title), LOWER($2)) > 0 OR $2 = '')
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
	concepts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*DevConcept, error) {
		var concept DevConcept
		var user User
		err := row.Scan(
			&totalRecords,
			&concept.ID,
			&concept.CreatedAt,
			&concept.UpdatedAt,
			&concept.Title,
			&concept.Description,
			&concept.Cover,
			&concept.Content,
			&concept.Version,
			&user.FullName,
		)
		concept.User = &user
		return &concept, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return concepts, metadata, nil
}

func (m DevConceptModel) Get(id int64) (*DevConcept, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT c.id, c.created_at, c.occured_on, c.updated_at, c.title, c.description, c.content, c.lang, c.cover, c.version
		FROM development_concepts c
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var concept DevConcept
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&concept.ID,
		&concept.CreatedAt,
		&concept.OccuredOn,
		&concept.UpdatedAt,
		&concept.Title,
		&concept.Description,
		&concept.Content,
		&concept.Lang,
		&concept.Cover,
		&concept.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &concept, nil
}

func (m DevConceptModel) Update(concept *DevConcept) error {
	query := `
		UPDATE development_concepts
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, occured_on = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		concept.Title,
		concept.Description,
		concept.Content,
		concept.Lang,
		concept.Cover,
		concept.OccuredOn,
		concept.ID,
		concept.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&concept.Version)
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

func (m DevConceptModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM development_concepts
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
