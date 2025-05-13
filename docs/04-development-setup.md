# Development Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Git
- Code editor (VS Code recommended)

## Local Setup Steps

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/visa-bot-admin.git
cd visa-bot-admin
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Fill in required environment variables:
   - `NEXT_PUBLIC_AUTOMATION_API_URL`
   - `NEXT_PUBLIC_API_KEY`

### 4. Run Development Server
```bash
pnpm dev
```

### 5. Build for Production
```bash
pnpm build
```

## Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- React Developer Tools

## Debugging
- Use Chrome DevTools
- React Developer Tools
- Next.js built-in error overlay

## Common Issues and Solutions
- Dependency conflicts: `pnpm install --force`
- TypeScript errors: Check `tsconfig.json`
- API connection issues: Verify `.env.local`

## Contribution Guidelines
1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Description of changes"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

## Code Style
- Follow ESLint and Prettier configurations
- Use TypeScript strict mode
- Write meaningful commit messages
