# Base image Python 3.9-alpine
FROM python:3.9-alpine

# Çalışma dizinini
WORKDIR /app

# Sistem paketleri
RUN apk update && \
    apk add --no-cache \
    build-base \
    libpq-dev \
    gcc \
    musl-dev \
    postgresql-dev \
    jpeg-dev \
    zlib-dev

# .env dosyası farklı bir konumdaysa dikkat.
COPY IHAKI/.env IHAKI/.env

# Python bağımlılıklarını yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Proje dosyaları
COPY . .

# Django uygulaması için environment değişkenleri
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Django statik dosyaları cachelemek için.
RUN python manage.py collectstatic --noinput

# Django sunucusunu başlatılıyor.
# Production ortamda wsgi veyahut nginx tercih edilebilir.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
