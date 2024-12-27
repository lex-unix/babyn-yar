CREATE TABLE IF NOT EXISTS holocaust_documents_translations (
  id bigserial PRIMARY KEY,
  english_id bigserial NOT NULL,
  ukrainian_id bigserial NOT NULL,
  FOREIGN KEY (english_id) REFERENCES holocaust_documents(id) ON DELETE CASCADE,
  FOREIGN KEY (ukrainian_id) REFERENCES holocaust_documents(id) ON DELETE CASCADE
);
