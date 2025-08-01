include ../.env

# .env' path
COMPOSE_CONFIG=--env-file ../.env -f docker-compose.$(MODE).yaml
# Default - dev, other - prod. Example: MODE=prod make up
MODE ?= dev


# Start containers
up:
	docker compose ${COMPOSE_CONFIG} up -d

# Stop and Delete all containers
down:
	docker compose ${COMPOSE_CONFIG} down

# Stop and Delete all containers and volume's data
clear:
	docker compose ${COMPOSE_CONFIG} down -v

# Clear Install: Delete and Install again all dependencies
install:
	docker compose ${COMPOSE_CONFIG} run --rm server npm ci
	docker compose ${COMPOSE_CONFIG} down