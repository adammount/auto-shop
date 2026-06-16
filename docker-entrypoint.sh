#!/bin/sh
set -e

echo "Starting server (migrations run on init via prodMigrations)..."
exec bun server.js
