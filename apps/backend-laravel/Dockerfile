FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev \
    postgresql-dev \
    oniguruma-dev \
    libzip-dev

# Install PHP extensions (supporting both SQLite and PostgreSQL)
RUN docker-php-ext-install pdo pdo_sqlite pdo_pgsql mbstring exif pcntl bcmath gd zip opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Expose port (Render automatically assigns $PORT, default 8000)
EXPOSE 8000

CMD ["sh", "-c", "touch /var/www/html/database/database.sqlite && chown -R www-data:www-data /var/www/html/database && chmod -R 775 /var/www/html/database && php artisan storage:link || true && php artisan migrate --force --seed || true && php artisan config:clear && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
