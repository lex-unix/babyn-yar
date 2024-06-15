CREATE TABLE IF NOT EXISTS gallery_images (
  id bigint REFERENCES assets(id) ON DELETE CASCADE,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  url text NOT NULL,
  PRIMARY KEY(id)
);
