#!/bin/sh
set -e

echo "Running Payload migrations..."
cd /app/migrate
bun payload migrate

echo "Starting server..."
cd /app
exec bun server.js
