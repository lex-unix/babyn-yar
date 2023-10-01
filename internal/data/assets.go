package data

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Asset struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	URL       string    `json:"url"`
	Filename  string    `json:"fileName"`
}

type AssetModel struct {
	DB *pgxpool.Pool
}

func (m AssetModel) Insert(asset *Asset) error {
	query := `
		INSERT INTO assets (url, file_name)
		VALUES ($1, $2)
		RETURNING id`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRow(ctx, query, asset.URL, asset.Filename).Scan(&asset.ID)
}

func (m AssetModel) GetAll(filename string, filters Filters) ([]*Asset, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT count(*) OVER(), id, created_at, url, file_name
		FROM assets
		WHERE (STRPOS(LOWER(file_name), LOWER($1)) > 0 OR $1 = '')
		ORDER BY %s %s, id ASC
		LIMIT $2 OFFSET $3 `, filters.sortColumn(), filters.sortDirection())

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{filename, filters.limit(), filters.offset()}

	rows, err := m.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, Metadata{}, err
	}
	defer rows.Close()

	totalRecords := 0
	assets, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*Asset, error) {
		var asset Asset
		err := row.Scan(&totalRecords, &asset.ID, &asset.CreatedAt, &asset.URL, &asset.Filename)
		return &asset, err
	})

	if err != nil {
		return nil, Metadata{}, err
	}

	metadata := calculateMetadata(totalRecords, filters.Page, filters.PageSize)

	return assets, metadata, nil
}
