CREATE TABLE IF NOT EXISTS books_translations (
  id bigserial PRIMARY KEY,
  english_id bigserial NOT NULL,
  ukrainian_id bigserial NOT NULL,
  FOREIGN KEY (english_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (ukrainian_id) REFERENCES books(id) ON DELETE CASCADE
);

