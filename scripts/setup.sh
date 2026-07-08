#!/usr/bin/env bash
set -euo pipefail

echo "🚀 WayPay Development Setup"
echo "==========================="

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v java >/dev/null 2>&1 || { echo "❌ Java 21 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }

# Copy .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env from .env.example — please update with your API keys"
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis, pgAdmin)..."
docker compose up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker compose exec -T postgres pg_isready -U waypay > /dev/null 2>&1; do
    sleep 1
done
echo "✅ PostgreSQL is ready"

# Wait for Redis
echo "⏳ Waiting for Redis to be ready..."
until docker compose exec -T redis redis-cli -a waypay_redis ping > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Redis is ready"

# Backend setup
echo "☕ Setting up Spring Boot backend..."
cd backend
if [ ! -f mvnw ]; then
    mvn -N wrapper:wrapper
fi
chmod +x mvnw
./mvnw clean compile -q
echo "✅ Backend compiled"
cd ..

# Frontend setup
echo "⚛️  Setting up Next.js frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  Backend:  cd backend && ./mvnw spring-boot:run"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Services:"
echo "  pgAdmin:  http://localhost:5050"
echo "  Swagger:  http://localhost:8080/swagger-ui"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
