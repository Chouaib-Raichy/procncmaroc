#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# PRO CNC MAROC — VPS Initial Setup
# Run once on a fresh Namecheap VPS (Ubuntu 22.04+)
# ──────────────────────────────────────────────

DOMAIN="procncmaroc.com"
ADMIN_EMAIL="chouaib@procncmaroc.com"
PHP_VERSION="8.3"

echo "=== Updating system packages ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing dependencies ==="
sudo apt install -y nginx mysql-server \
  php$PHP_VERSION-fpm php$PHP_VERSION-mysql php$PHP_VERSION-xml \
  php$PHP_VERSION-mbstring php$PHP_VERSION-curl php$PHP_VERSION-bcmath \
  php$PHP_VERSION-zip php$PHP_VERSION-gd php$PHP_VERSION-intl \
  composer unzip git certbot python3-certbot-nginx

echo "=== Securing MySQL ==="
sudo mysql_secure_installation

echo "=== Creating database ==="
sudo mysql -e "CREATE DATABASE IF NOT EXISTS procncmaroc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'procncmaroc'@'localhost' IDENTIFIED BY 'CHANGE_ME';"
sudo mysql -e "GRANT ALL PRIVILEGES ON procncmaroc.* TO 'procncmaroc'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "=== Creating directory structure ==="
sudo mkdir -p /var/www/procncmaroc
sudo chown -R $USER:$USER /var/www/procncmaroc

# The deploy step will place files here:
# /var/www/procncmaroc/api/          ← Laravel backend
# /var/www/procncmaroc/public_html/  ← Vue SPA dist

echo "=== Creating storage directory outside api/ ==="
mkdir -p /var/www/procncmaroc/storage/app/public
mkdir -p /var/www/procncmaroc/storage/framework/cache/data
mkdir -p /var/www/procncmaroc/storage/framework/sessions
mkdir -p /var/www/procncmaroc/storage/framework/views
mkdir -p /var/www/procncmaroc/storage/logs

echo "=== Symlink api/public into public_html ==="
ln -sf /var/www/procncmaroc/api/public /var/www/procncmaroc/public_html/api

echo "=== Configuring Nginx ==="
sudo cp deploy/nginx.conf /etc/nginx/sites-available/$DOMAIN
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

echo "=== Obtaining SSL certificate ==="
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL

echo "=== Enabling auto-renew ==="
sudo systemctl enable certbot.timer

echo "=== Setting up deployment directory permissions ==="
sudo chown -R www-data:www-data /var/www/procncmaroc/storage

echo ""
echo "============================================"
echo "  VPS setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Push code from GitHub (CI/CD will deploy)"
echo "  2. SSH in and run:"
echo "     cd /var/www/procncmaroc/api"
echo "     cp .env.example .env"
echo "     # Edit .env with DB credentials & APP_URL"
echo "     php artisan key:generate"
echo "     php artisan migrate --force"
echo "     php artisan storage:link"
echo "     php artisan config:cache"
echo "     php artisan route:cache"
echo "     sudo systemctl reload nginx"
echo "============================================"
