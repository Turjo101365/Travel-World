# Use an official PHP image with Apache
FROM php:8.4-apache

# Build-time environment arguments with production-friendly defaults
ARG APP_NAME=Travel-World
ARG APP_ENV=production
ARG APP_KEY=base64:TXoGZW2StiHRh+8lzWOfim3iU28WT+Vjov4c3G/gk+Y=
ARG APP_DEBUG=false
ARG APP_URL=https://travel-world-o473.onrender.com
ARG FRONTEND_URL=https://travel-world-xeys.vercel.app
ARG LOG_LEVEL=error
ARG DB_CONNECTION=mysql
ARG DB_HOST=127.0.0.1
ARG DB_PORT=3307
ARG DB_DATABASE=TravelDB
ARG DB_USERNAME=root
ARG DB_PASSWORD=root123

ARG VITE_BACKEND_ENDPOINT=https://travel-world-o473.onrender.com

# Expose build-time env values as runtime environment variables
ENV APP_NAME=${APP_NAME}
ENV APP_ENV=${APP_ENV}
ENV APP_KEY=${APP_KEY}
ENV APP_DEBUG=${APP_DEBUG}
ENV APP_URL=${APP_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV LOG_LEVEL=${LOG_LEVEL}
ENV DB_CONNECTION=${DB_CONNECTION}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV VITE_BACKEND_ENDPOINT=${VITE_BACKEND_ENDPOINT}

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Enable mod_rewrite
RUN a2enmod rewrite

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# By default, Apache serves files from /var/www/html.
# Laravel expects the document root to point to the public directory of its project structure for proper routing and security.
# These commands update Apache’s configuration so that it serves files from /var/www/html/public instead, aligning it with Laravel's structure.
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the application code to the html folder
# COPY . /var/www/html

# Copy Laravel backend code
COPY server/ /var/www/html
COPY client/ /var/www/html/client

# Set working directory
WORKDIR /var/www/html

# Remove any existing vendor directory to avoid conflicts
RUN rm -rf vendor

# Clear composer cache
RUN composer clear-cache

# Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# RUN ls -a
# RUN echo "hello wrld"

RUN cd client && npm install && npm run build

# # Move React build to Laravel public directory
RUN cp -r client/dist/* public/

# # Expose port 80 for Apache
EXPOSE 80

CMD ["apache2-foreground"]
