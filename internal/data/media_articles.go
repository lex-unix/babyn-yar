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

type MediaArticle struct {
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

type MediaArticleModel struct {
	DB *pgxpool.Pool
}

func ValidateMediaArticle(v *validator.Validator, article *MediaArticle) {
	v.Check(article.Title != "", "title", "must no be empty")
	v.Check(article.Description != "", "description", "must no be empty")
	v.Check(article.Content != "", "content", "must no be empty")
	v.Check(article.Lang != "", "lang", "must not be empty")
	v.Check(validator.In(article.Lang, "ua", "en"), "lang", "must be either ua or en")
	v.Check(article.Cover != "", "cover", "must not be empty")
	v.Check(!article.OccuredOn.IsZero(), "occuredOn", "must be a valid date")
}

func (m MediaArticleModel) Insert(article *MediaArticle) error {
	query := `
		INSERT INTO media_articles (title, description, content, lang, cover, occured_on, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, version`

	args := []interface{}{
		article.Title,
		article.Description,
		article.Content,
		article.Lang,
		article.Cover,
		article.OccuredOn,
		article.UserID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, args...).Scan(&article.ID, &article.Version)
}

func (m MediaArticleModel) GetAll(title, lang string, filters Filters) ([]*MediaArticle, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), a.id, a.created_at, a.updated_at, a.title, a.description, a.cover, a.content, a.version, u.full_name
		FROM media_articles a
		INNER JOIN users u ON a.user_id = u.id
		WHERE (a.lang = $1 OR $1 = '')
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
	articles, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*MediaArticle, error) {
		var article MediaArticle
		var user User
		err := row.Scan(
			&totalRecords,
			&article.ID,
			&article.CreatedAt,
			&article.UpdatedAt,
			&article.Title,
			&article.Description,
			&article.Cover,
			&article.Content,
			&article.Version,
			&user.FullName,
		)
		article.User = &user
		return &article, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return articles, metadata, nil
}

func (m MediaArticleModel) Get(id int64) (*MediaArticle, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT a.id, a.created_at, a.occured_on, a.updated_at, a.title, a.description, a.content, a.lang, a.cover, a.version
		FROM media_articles a
		WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var article MediaArticle
	err := m.DB.QueryRow(ctx, query, id).Scan(
		&article.ID,
		&article.CreatedAt,
		&article.OccuredOn,
		&article.UpdatedAt,
		&article.Title,
		&article.Description,
		&article.Content,
		&article.Lang,
		&article.Cover,
		&article.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &article, nil
}

func (m MediaArticleModel) Update(article *MediaArticle) error {
	query := `
		UPDATE media_articles
		SET title = $1, description = $2, content = $3, lang = $4, cover = $5, occured_on = $6, updated_at = now(), version = version + 1
		WHERE id = $7 AND version = $8
		RETURNING version`

	args := []interface{}{
		article.Title,
		article.Description,
		article.Content,
		article.Lang,
		article.Cover,
		article.OccuredOn,
		article.ID,
		article.Version,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRow(ctx, query, args...).Scan(&article.Version)
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

func (m MediaArticleModel) DeleteMultiple(ids []int64) error {
	query := `
		DELETE FROM media_articles
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

func (m MediaArticleModel) CreateTranslation(translation *Translation) error {
	query := `
	INSERT INTO media_articles_translations (ukrainian_id, english_id)
	VALUES ($1, $2)
	RETURNING id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, translation.UkrainianID, translation.EnglishID).Scan(&translation.ID)
}

func (m MediaArticleModel) GetTranslation(id int64) (*Translation, error) {
	query := `
		SELECT t.id, t.ukrainian_id, t.english_id, media_articles_ua.title, media_articles_en.title
		FROM media_articles_translations t
		JOIN media_articles media_articles_ua ON  media_articles_ua.id = t.ukrainian_id
		JOIN media_articles media_articles_en ON  media_articles_en.id = t.english_id
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

func (m MediaArticleModel) UpdateTranslation(translation *Translation) error {
	query := `
		UPDATE  media_articles_translations
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

func (m MediaArticleModel) DeleteTranslation(id int64) error {
	query := `
		DELETE FROM media_articles_translations
		WHERE english_id = $1 OR ukrainian_id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
