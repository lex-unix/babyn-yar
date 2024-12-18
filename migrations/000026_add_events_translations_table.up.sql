CREATE TABLE IF NOT EXISTS event_translations (
  id bigserial PRIMARY KEY,
  english_id bigserial NOT NULL,
  ukrainian_id bigserial NOT NULL,
  FOREIGN KEY (english_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (ukrainian_id) REFERENCES events(id) ON DELETE CASCADE
);
