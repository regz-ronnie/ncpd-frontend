#!/bin/bash

# Start Gunicorn for Django
echo "Starting Gunicorn..."
exec gunicorn backend.backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3
