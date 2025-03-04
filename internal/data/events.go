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

type Event struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	OccuredOn   time.Time `json:"occuredOn"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Cover       string    `json:"cover"`
	Lang        string    `json:"lang"`
	Documents   []string  `json:"documents"`
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
	v.Check(event.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(event.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(event.Cover != "", "cover", "must not be empty")
	v.Check(!event.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m EventModel) Insert(event *Event) error {
	query := `
		INSERT INTO events (title, description, content, lang, documents, cover, occured_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, version`

	args := []interface{}{
		event.Title,
		event.Description,
		event.Content,
		event.Lang,
		event.Documents,
		event.Cover,
		event.OccuredOn,
		event.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&event.ID, &event.Version)
}

func (m EventModel) GetAll(title, lang string, filters Filters) ([]*Event, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), e.id, e.created_at, e.updated_at, e.title, e.description, e.cover, e.content, e.documents, e.version, u.full_name
		FROM events e
		INNER JOIN users u ON e.user_id = u.id
		WHERE (e.lang = $1 OR $1 = '')
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
	events, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Event, error) {
		var event Event
		var user User
		err := row.Scan(
			&totalRecords,
			&event.ID,
			&event.CreatedAt,
			&event.UpdatedAt,
			&event.Title,
			&event.Description,
			&event.Cover,
			&event.Content,
			&event.Documents,
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
		SELECT e.id, e.created_at, e.occured_on, e.updated_at, e.title, e.description, e.content, e.documents, e.lang, e.cover, e.version
		FROM events e
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var event Event
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&event.ID,
		&event.CreatedAt,
		&event.OccuredOn,
		&event.UpdatedAt,
		&event.Title,
		&event.Description,
		&event.Content,
		&event.Documents,
		&event.Lang,
		&event.Cover,
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
		SET title = $1, description = $2, content = $3, documents = $4, lang = $5, cover = $6, occured_on = $7, updated_at = now(), version = version + 1
		WHERE id = $8 AND version = $9
		RETURNING version`

	args := []interface{}{
		event.Title,
		event.Description,
		event.Content,
		event.Documents,
		event.Lang,
		event.Cover,
		event.OccuredOn,
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

func (m EventModel) CreateTranslation(translation *Translation) error {
	query := `
	INSERT INTO event_translations (ukrainian_id, english_id)
	VALUES ($1, $2)
	RETURNING id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, translation.UkrainianID, translation.EnglishID).Scan(&translation.ID)
}

func (m EventModel) GetTranslation(id int64) (*Translation, error) {
	query := `
		SELECT t.id, t.ukrainian_id, t.english_id, events_ua.title, events_en.title
		FROM event_translations t
		JOIN events events_ua ON  events_ua.id = t.ukrainian_id
		JOIN events events_en ON  events_en.id = t.english_id
		WHERE t.ukrainian_id = $1 OR t.english_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var translation Translation
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&translation.ID,
		&translation.UkrainianID,
		&translation.EnglishID,
		&translation.UkrainianTitle,
		&translation.EnglishTitle,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &translation, nil
}

func (m EventModel) UpdateTranslation(translation *Translation) error {
	query := `
		UPDATE  event_translations
		SET ukrainian_id = $1, english_id = $2
		WHERE id = $3`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{translation.UkrainianID, translation.EnglishID, translation.ID}

	_, err := m.DB.Exec(ctx, query, args...)
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

func (m EventModel) DeleteTranslation(id int64) error {
	query := `
		DELETE FROM event_translations
		WHERE english_id = $1 OR ukrainian_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
