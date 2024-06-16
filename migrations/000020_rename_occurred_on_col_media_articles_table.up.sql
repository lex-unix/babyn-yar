BEGIN TRANSACTION;

ALTER TABLE media_articles
RENAME COLUMN occurred_on TO occured_on;

COMMIT;
