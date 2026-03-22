include .env

# Запуск тільки апішки (FastAPI сервер)
run-api:
	uvicorn api.main:app

run-apir:
	uvicorn api.main:app --reload

run-web:
	cd web && pnpm dev

# Запуск усіх служб разом (бот, апішка, парсер)
run-all:
	@echo "Запускаю API, бота та парсер паралельно"
	@$(MAKE) run-api & \
	@$(MAKE) run-web & \
	wait

dump-data:
	python -m api.scripts.dump_data


migrations:
	alembic revision --autogenerate -m "$(m)"

migrate:
	alembic upgrade head

downgrade:
	alembic downgrade -1


# ===========DOCKER ===========

local-up-build:
	docker compose --env-file .env.docker down
	docker compose --env-file .env.docker -f docker-compose.yml up --build

local-up:
	docker compose --env-file .env.docker down
	docker compose --env-file .env.docker -f docker-compose.yml up

local-down:
	docker compose -f docker-compose.yml down
