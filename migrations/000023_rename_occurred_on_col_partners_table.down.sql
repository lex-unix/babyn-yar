BEGIN TRANSACTION;

ALTER TABLE partners
RENAME COLUMN occured_on TO occurred_on;

COMMIT;
