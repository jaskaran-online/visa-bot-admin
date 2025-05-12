#!/bin/bash

# Script to help manage the visa-bot-admin project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
  echo -e "${GREEN}Visa Bot Admin Helper Script${NC}"
  echo ""
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Commands:"
  echo "  setup       - Install dependencies and prepare the environment"
  echo "  dev         - Start the development server"
  echo "  build       - Build the project for production"
  echo "  start       - Start the production server"
  echo "  lint        - Run linting checks"
  echo "  test        - Run tests"
  echo "  help        - Show this help message"
  echo ""
}

# Function to check if pnpm is installed
check_pnpm() {
  if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm is not installed.${NC}"
    echo "Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
  fi
}

# Function to check if .env.local exists
check_env() {
  if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
    echo "Creating .env.local from .env.example..."
    if [ -f .env.example ]; then
      cp .env.example .env.local
      echo -e "${GREEN}Created .env.local file. Please edit it with your API settings.${NC}"
    else
      echo "# Visa Bot Admin Environment Variables" > .env.local
      echo "" >> .env.local
      echo "# API Connection" >> .env.local
      echo "NEXT_PUBLIC_AUTOMATION_API_URL=https://api.example.com" >> .env.local
      echo "NEXT_PUBLIC_API_KEY=your_api_key_here" >> .env.local
      echo -e "${GREEN}Created default .env.local file. Please edit it with your API settings.${NC}"
    fi
  fi
}

# Setup command
setup() {
  check_pnpm
  echo -e "${GREEN}Installing dependencies...${NC}"
  pnpm install
  check_env
  echo -e "${GREEN}Setup complete!${NC}"
}

# Development server command
dev() {
  check_pnpm
  check_env
  echo -e "${GREEN}Starting development server...${NC}"
  pnpm dev
}

# Build command
build() {
  check_pnpm
  check_env
  echo -e "${GREEN}Building for production...${NC}"
  pnpm build
}

# Start command
start() {
  check_pnpm
  check_env
  echo -e "${GREEN}Starting production server...${NC}"
  pnpm start
}

# Lint command
lint() {
  check_pnpm
  echo -e "${GREEN}Running lint checks...${NC}"
  pnpm lint
}

# Test command
test() {
  check_pnpm
  echo -e "${GREEN}Running tests...${NC}"
  pnpm test
}

# Main logic
case "$1" in
  setup)
    setup
    ;;
  dev)
    dev
    ;;
  build)
    build
    ;;
  start)
    start
    ;;
  lint)
    lint
    ;;
  test)
    test
    ;;
  help|*)
    show_help
    ;;
esac
