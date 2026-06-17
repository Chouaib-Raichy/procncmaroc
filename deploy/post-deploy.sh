#!/usr/bin/env bash
# Run AFTER the first deployment via CI/CD
set -euo pipefail

APP_DIR="/var/www/procncmaroc/api"

cd "$APP_DIR"

echo "=== Installing Composer dependencies ==="
composer install --no-dev --optimize-autoloader

echo "=== Setting up .env ==="
if [ ! -f .env ]; then
    cp .env.example .env
    echo ">>> .env created from .env.example"
    echo ">>> EDIT .env with your database credentials and APP_URL before continuing!"
    exit 1
fi

echo "=== Generating app key ==="
php artisan key:generate --force

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Caching ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Storage link ==="
php artisan storage:link

echo "=== Setting permissions ==="
sudo chown -R www-data:www-data "$APP_DIR/storage"
sudo chown -R www-data:www-data "$APP_DIR/bootstrap/cache"

echo "=== Reloading PHP-FPM ==="
sudo systemctl reload php8.3-fpm

echo "=== Done! ==="
