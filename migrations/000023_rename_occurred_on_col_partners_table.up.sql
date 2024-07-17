BEGIN TRANSACTION;

ALTER TABLE partners
RENAME COLUMN occurred_on TO occured_on;

COMMIT;

