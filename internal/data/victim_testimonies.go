package data

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VictimTestimony struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Cover       string    `json:"cover"`
	Lang        string    `json:"lang"`
	Documents   []string  `json:"documents"`
	Version     int32     `json:"version"`
	UserID      int64     `json:"-"`
	User        *User     `json:"user,omitempty"`
}

type VictimTestimonyModel struct {
	DB *pgxpool.Pool
}

func (m VictimTestimonyModel) Insert(testimony *VictimTestimony) error {
	query := `
		INSERT INTO victim_testimonies (title, description, content, lang, cover, documents, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		testimony.Title,
		testimony.Description,
		testimony.Content,
		testimony.Lang,
		testimony.Cover,
		testimony.Documents,
		testimony.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&testimony.ID, &testimony.Version)
}

func (m VictimTestimonyModel) GetAll(lang string, filters Filters) ([]*VictimTestimony, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), vt.id, vt.created_at, vt.updated_at, vt.title, vt.description, vt.cover, vt.content, vt.documents, vt.version, u.full_name
		FROM victim_testimonies vt
		INNER JOIN users u ON vt.user_id = u.id
		WHERE (vt.lang = $1 OR $1 = '')
		ORDER BY %s %s, id ASC
		LIMIT $2 OFFSET $3`, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{lang, filters.limit(), filters.offset()}

	rows, err := m.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}

	totalRecords := 0
	testimonies, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*VictimTestimony, error) {
		var testimony VictimTestimony
		var user User
		err := row.Scan(
			&totalRecords,
			&testimony.ID,
			&testimony.CreatedAt,
			&testimony.UpdatedAt,
			&testimony.Title,
			&testimony.Description,
			&testimony.Cover,
			&testimony.Content,
			&testimony.Documents,
			&testimony.Version,
			&user.FullName,
		)
		testimony.User = &user
		return &testimony, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return testimonies, metadata, nil
}

func (m VictimTestimonyModel) Get(id int64) (*VictimTestimony, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT vt.id, vt.title, vt.description, vt.content, vt.lang, vt.cover, vt.documents, vt.version
		FROM victim_testimonies vt
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var testimony VictimTestimony
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&testimony.ID,
		&testimony.Title,
		&testimony.Description,
		&testimony.Content,
		&testimony.Lang,
		&testimony.Cover,
		&testimony.Documents,
		&testimony.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &testimony, nil
}

func (m VictimTestimonyModel) Update(testimony *VictimTestimony) error {
	query := `
		UPDATE victim_testimonies
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, documents = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		testimony.Title,
		testimony.Description,
		testimony.Content,
		testimony.Lang,
		testimony.Cover,
		testimony.Documents,
		testimony.ID,
		testimony.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&testimony.Version)
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
