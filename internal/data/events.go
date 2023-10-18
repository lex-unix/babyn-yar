package data

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

type Event struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Version     int32     `json:"version"`
	UserID      int64     `json:"-"`
	User        *User     `json:"user"`
}

type EventModel struct {
	DB *pgxpool.Pool
}

func ValidateEvent(v *validator.Validator, event *Event) {
	v.Check(event.Title != "", "title", "must no be empty")
	v.Check(event.Description != "", "description", "must no be empty")
	v.Check(event.Content != "", "content", "must no be empty")
}

func (m EventModel) Insert(event *Event) error {
	query := `
		INSERT INTO events (title, description, content, user_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, version`

	args := []interface{}{event.Title, event.Description, event.Content, event.UserID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&event.ID, &event.Version)
}

func (m EventModel) GetAll(filters Filters) ([]*Event, Metadata, error) {
	query := `
		SELECT count(*) OVER(), e.id, e.created_at, e.updated_at, e.title, e.description, e.content, e.version, u.full_name
		FROM events e
		INNER JOIN users u ON e.user_id = u.id
		ORDER BY e.created_at DESC`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.Query(ctx, query)
	if err != nil {
		return nil, Metadata{}, err
	}

	totalRecords := 0
	events, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Event, error) {
		var event Event
		var user User
		err := row.Scan(&totalRecords,
			&event.ID,
			&event.CreatedAt,
			&event.UpdatedAt,
			&event.Title,
			&event.Description,
			&event.Content,
			&event.Version,
			&user.FullName,
		)
		event.User = &user
		return &event, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return events, metadata, nil
}

func (m EventModel) Get(id int64) (*Event, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT e.id, e.title, e.description, e.content, e.version
		FROM events e
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var event Event
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&event.ID,
		&event.Title,
		&event.Description,
		&event.Content,
		&event.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &event, nil
}

func (m EventModel) Update(event *Event) error {
	query := `
		UPDATE events
		SET title = $1, description = $2, content = $3, updated_at = now(), version = version + 1
		WHERE id = $4 AND version = $5
		RETURNING version`

	args := []interface{}{
		event.Title,
		event.Description,
		event.Content,
		event.ID,
		event.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&event.Version)
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

func (m EventModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM events
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
