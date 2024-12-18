CREATE TABLE IF NOT EXISTS media_articles_translations (
  id bigserial PRIMARY KEY,
  english_id bigserial NOT NULL,
  ukrainian_id bigserial NOT NULL,
  FOREIGN KEY (english_id) REFERENCES media_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (ukrainian_id) REFERENCES media_articles(id) ON DELETE CASCADE
);

