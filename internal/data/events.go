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
		INSERT INTO events (title, description, content)
		VALUES ($1, $2, $3)
		RETURNING id, version`

	args := []interface{}{event.Title, event.Description, event.Content}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&event.ID, &event.Version)
}

func (m EventModel) GetAll(filters Filters) ([]*Event, Metadata, error) {
	query := `
		SELECT count(*) OVER(), id, created_at, updated_at, title, description, content, version
		FROM events
		ORDER BY created_at DESC`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.Query(ctx, query)
	if err != nil {
		return nil, Metadata{}, err
	}

	totalRecords := 0
	events, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Event, error) {
		var event Event
		err := row.Scan(&totalRecords,
			&event.ID,
			&event.CreatedAt,
			&event.UpdatedAt,
			&event.Title,
			&event.Description,
			&event.Content,
			&event.Version,
		)
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
		SELECT id, title, description, content, version
		FROM events
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
