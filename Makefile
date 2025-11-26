.PHONY: help install dev build start lint clean docker-build docker-run docker-stop docker-clean docker-logs compose-up compose-down compose-logs compose-restart

# Variables
IMAGE_NAME := nextjs-liff
CONTAINER_NAME := nextjs-liff-app
PORT := 3000

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
install: ## Install dependencies
	npm install

dev: ## Run development server
	npm run dev

build: ## Build Next.js application
	npm run build

start: ## Start production server
	npm run start

lint: ## Run linter
	npm run lint

clean: ## Clean build artifacts and dependencies
	rm -rf .next
	rm -rf node_modules
	rm -rf out

# Docker commands
docker-build: ## Build Docker image
	docker build -t $(IMAGE_NAME) .

docker-run: ## Run Docker container
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):3000 \
		--env-file .env.local \
		$(IMAGE_NAME)

docker-stop: ## Stop Docker container
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

docker-clean: docker-stop ## Remove Docker image and container
	docker rmi $(IMAGE_NAME) || true

docker-logs: ## Show Docker container logs
	docker logs -f $(CONTAINER_NAME)

docker-shell: ## Open shell in running container
	docker exec -it $(CONTAINER_NAME) sh

docker-rebuild: docker-stop docker-build docker-run ## Rebuild and restart Docker container

# Docker Compose commands
compose-up: ## Start services with docker-compose
	docker-compose up -d

compose-down: ## Stop services with docker-compose
	docker-compose down

compose-logs: ## Show docker-compose logs
	docker-compose logs -f

compose-restart: ## Restart docker-compose services
	docker-compose restart

compose-build: ## Build docker-compose services
	docker-compose build

compose-rebuild: compose-down compose-build compose-up ## Rebuild and restart docker-compose services

# Combined commands
deploy: docker-build docker-stop docker-run ## Build and deploy Docker container

redeploy: docker-rebuild ## Rebuild and redeploy Docker container
