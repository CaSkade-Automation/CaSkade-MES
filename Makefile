# SkillMEx Docker Commands

.PHONY: help build up down logs shell clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Production commands
build: ## Build all Docker images for production
	docker-compose build

up: ## Start all services in production mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs from all services
	docker-compose logs -f

# Development commands
dev-build: ## Build all Docker images for development
	docker-compose -f docker-compose.dev.yml build

dev-up: ## Start all services in development mode with hot reload
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Stop all development services
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Show logs from development services
	docker-compose -f docker-compose.dev.yml logs -f

# Service-specific commands
backend-shell: ## Open shell in backend container
	docker-compose exec backend sh

frontend-shell: ## Open shell in frontend container
	docker-compose exec frontend sh

graphdb-shell: ## Open shell in GraphDB container
	docker-compose exec graphdb bash

# GraphDB commands
graphdb-init: ## Initialize GraphDB repository
	@echo "Creating test-repo in GraphDB..."
	@sleep 10 # Wait for GraphDB to be ready
	curl -X POST http://localhost:7200/rest/repositories \
		-H 'Content-Type: application/json' \
		-d '{"id":"test-repo","type":"free","title":"Test Repository","params":{"imports":{"name":"imports","value":""},"defaultNS":{"name":"defaultNS","value":""}}}'

# Utility commands
clean: ## Remove all containers, networks, and volumes
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

prune: ## Remove all unused Docker resources
	docker system prune -af --volumes

# Build specific services
build-backend: ## Build only backend image
	docker-compose build backend

build-frontend: ## Build only frontend image
	docker-compose build frontend

# Health check
health: ## Check health status of all services
	@echo "Checking service health..."
	@docker-compose ps
	@echo "\nGraphDB: http://localhost:7200"
	@echo "Backend API: http://localhost:9090/api"
	@echo "Frontend: http://localhost (production) or http://localhost:4200 (development)"