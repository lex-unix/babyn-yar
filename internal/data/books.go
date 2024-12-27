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

type Book struct {
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
	User        *User     `json:"user,omitempty"`
}

type BookModel struct {
	DB *pgxpool.Pool
}

func ValidateBook(v *validator.Validator, book *Book) {
	v.Check(book.Title != "", "title", "must no be empty")
	v.Check(book.Description != "", "description", "must no be empty")
	v.Check(book.Content != "", "content", "must no be empty")
	v.Check(book.Cover != "", "cover", "must not be empty")
	v.Check(book.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(book.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(!book.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m BookModel) Insert(book *Book) error {
	query := `
		INSERT INTO books (title, description, content, lang, cover, documents, occured_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, version`

	args := []interface{}{
		book.Title,
		book.Description,
		book.Content,
		book.Lang,
		book.Cover,
		book.Documents,
		book.OccuredOn,
		book.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&book.ID, &book.Version)
}

func (m BookModel) GetAll(lang, title string, filters Filters) ([]*Book, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), b.id, b.created_at, b.updated_at, b.occured_on, b.title, b.description, b.cover, b.content, b.documents, b.version, u.full_name
		FROM books b
		INNER JOIN users u ON b.user_id = u.id
		WHERE (b.lang = $1 OR $1 = '')
		AND (STRPOS(LOWER(b.title), LOWER($2)) > 0 OR $2 = '')
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
	books, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Book, error) {
		var book Book
		var user User
		err := row.Scan(
			&totalRecords,
			&book.ID,
			&book.CreatedAt,
			&book.UpdatedAt,
			&book.OccuredOn,
			&book.Title,
			&book.Description,
			&book.Cover,
			&book.Content,
			&book.Documents,
			&book.Version,
			&user.FullName,
		)
		book.User = &user
		return &book, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return books, metadata, nil
}

func (m BookModel) Get(id int64) (*Book, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT b.id, b.created_at, b.occured_on, b.title, b.description, b.content, b.lang, b.cover, b.documents, b.version
		FROM books b
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var book Book
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&book.ID,
		&book.CreatedAt,
		&book.OccuredOn,
		&book.Title,
		&book.Description,
		&book.Content,
		&book.Lang,
		&book.Cover,
		&book.Documents,
		&book.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &book, nil
}

func (m BookModel) Update(book *Book) error {
	query := `
		UPDATE books
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, documents = $6, occured_on = $7, updated_at = now(), version = version + 1
		WHERE id = $8 AND version = $9
		RETURNING version`

	args := []interface{}{
		book.Title,
		book.Description,
		book.Content,
		book.Lang,
		book.Cover,
		book.Documents,
		book.OccuredOn,
		book.ID,
		book.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&book.Version)
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

func (m BookModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM books
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

func (m BookModel) CreateTranslation(translation *Translation) error {
	query := `
	INSERT INTO books_translations (ukrainian_id, english_id)
	VALUES ($1, $2)
	RETURNING id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, translation.UkrainianID, translation.EnglishID).Scan(&translation.ID)
}

func (m BookModel) GetTranslation(id int64) (*Translation, error) {
	query := `
		SELECT t.id, t.ukrainian_id, t.english_id, books_ua.title, books_en.title
		FROM books_translations t
		JOIN books books_ua ON  books_ua.id = t.ukrainian_id
		JOIN books books_en ON  books_en.id = t.english_id
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

func (m BookModel) UpdateTranslation(translation *Translation) error {
	query := `
		UPDATE  books_translations
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

func (m BookModel) DeleteTranslation(id int64) error {
	query := `
		DELETE FROM books_translations
		WHERE english_id = $1 OR ukrainian_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
