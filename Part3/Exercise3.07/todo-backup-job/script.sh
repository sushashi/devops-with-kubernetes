#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

URL="postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}"

pg_dump -v $URL > backup.sql

echo "Backing up database, $TIMESTAMP"

curl -X POST --upload-file backup.sql \
    -H "Authorization: Bearer ${TOKEN}" \
    "https://storage.googleapis.com/upload/storage/v1/b/dwk-project-backup-bucket/o?uploadType=media&name=backup-${TIMESTAMP}.sql"
