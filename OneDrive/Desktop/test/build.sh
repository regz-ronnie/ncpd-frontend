#!/bin/bash
# Exit on error
set -e

# Print current directory and files for debugging
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Install Python dependencies
echo "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    echo "Found requirements.txt, installing..."
    pip install -r requirements.txt
else
    echo "ERROR: requirements.txt not found in $(pwd)"
    exit 1
fi

# Install frontend dependencies and build
if [ -d "frontend" ]; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "WARNING: frontend directory not found, skipping frontend build"
fi

# Collect static files
if [ -f "manage.py" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
else
    echo "WARNING: manage.py not found, skipping collectstatic"
fi

echo "Build completed successfully!"
