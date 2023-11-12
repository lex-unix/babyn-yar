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

}

func (m BookModel) Insert(book *Book) error {
	query := `
		INSERT INTO books (title, description, content, lang, cover, documents, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		book.Title,
		book.Description,
		book.Content,
		book.Lang,
		book.Cover,
		book.Documents,
		book.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&book.ID, &book.Version)
}

func (m BookModel) GetAll(lang string, filters Filters) ([]*Book, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), b.id, b.created_at, b.updated_at, b.title, b.description, b.cover, b.content, b.documents, b.version, u.full_name
		FROM books b
		INNER JOIN users u ON b.user_id = u.id
		WHERE (b.lang = $1 OR $1 = '')
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
	books, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Book, error) {
		var book Book
		var user User
		err := row.Scan(
			&totalRecords,
			&book.ID,
			&book.CreatedAt,
			&book.UpdatedAt,
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
		SELECT b.id, b.title, b.description, b.content, b.lang, b.cover, b.documents, b.version
		FROM books b
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var book Book
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&book.ID,
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
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, documents = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		book.Title,
		book.Description,
		book.Content,
		book.Lang,
		book.Cover,
		book.Documents,
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
