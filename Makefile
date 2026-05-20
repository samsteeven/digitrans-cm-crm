.PHONY: install test dev staging prod shell-backend shell-db logs clean

# Installation initiale
install:
	cd src/backend && composer install
	cd src/frontend && npm install
	cp -n src/backend/.env.example src/backend/.env || true
	cd src/backend && php artisan key:generate
	cd src/backend && php artisan migrate --seed

# Tests
test:
	cd src/backend && php artisan test
	cd src/frontend && npm test -- --run

# Demarrage environnement de developpement
dev:
	docker compose up -d --build

# Demarrage environnement de staging
staging:
	docker compose -f docker-compose.staging.yml up -d --build

# Demarrage environnement de production
prod:
	docker compose -f docker-compose.staging.yml up -d --build

# Acces shell aux conteneurs
shell-backend:
	docker compose exec backend sh

shell-db:
	docker compose exec db psql -U digitrans digitrans_crm

# Logs
logs:
	docker compose logs -f

# Nettoyage
clean:
	docker compose down -v
	rm -rf src/backend/vendor src/frontend/node_modules
