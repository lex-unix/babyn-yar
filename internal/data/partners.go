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

type Partner struct {
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

type PartnerModel struct {
	DB *pgxpool.Pool
}

func ValidatePartner(v *validator.Validator, partner *Partner) {
	v.Check(partner.Title != "", "title", "must no be empty")
	v.Check(partner.Description != "", "description", "must no be empty")
	v.Check(partner.Content != "", "content", "must no be empty")
	v.Check(partner.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(partner.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(partner.Cover != "", "cover", "must not be empty")
	v.Check(!partner.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m PartnerModel) Insert(partner *Partner) error {
	query := `
		INSERT INTO partners (title, description, content, lang, cover, occurred_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		partner.Title,
		partner.Description,
		partner.Content,
		partner.Lang,
		partner.Cover,
		partner.OccuredOn,
		partner.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&partner.ID, &partner.Version)
}

func (m PartnerModel) GetAll(title, lang string, filters Filters) ([]*Partner, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), p.id, p.created_at, p.updated_at, p.title, p.description, p.cover, p.content, p.version, u.full_name
		FROM partners p
		INNER JOIN users u ON p.user_id = u.id
		WHERE (p.lang = $1 OR $1 = '')
		AND (STRPOS(LOWER(p.title), LOWER($2)) > 0 OR $2 = '')
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
	partners, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Partner, error) {
		var partner Partner
		var user User
		err := row.Scan(
			&totalRecords,
			&partner.ID,
			&partner.CreatedAt,
			&partner.UpdatedAt,
			&partner.Title,
			&partner.Description,
			&partner.Cover,
			&partner.Content,
			&partner.Version,
			&user.FullName,
		)
		partner.User = &user
		return &partner, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return partners, metadata, nil
}

func (m PartnerModel) Get(id int64) (*Partner, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT p.id, p.created_at, p.occurred_on, p.updated_at, p.title, p.description, p.content, p.lang, p.cover, p.version
		FROM partners p
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var partner Partner
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&partner.ID,
		&partner.CreatedAt,
		&partner.OccuredOn,
		&partner.UpdatedAt,
		&partner.Title,
		&partner.Description,
		&partner.Content,
		&partner.Lang,
		&partner.Cover,
		&partner.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &partner, nil
}

func (m PartnerModel) Update(partner *Partner) error {
	query := `
		UPDATE partners
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, occurred_on = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		partner.Title,
		partner.Description,
		partner.Content,
		partner.Lang,
		partner.Cover,
		partner.OccuredOn,
		partner.ID,
		partner.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&partner.Version)
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

func (m PartnerModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM partners
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
