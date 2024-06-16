BEGIN TRANSACTION;

ALTER TABLE media_articles
RENAME COLUMN occured_on TO occurred_on;

COMMIT;
