# Visa Bot Admin Dashboard

This project is an admin dashboard for managing automated visa appointment bots. It provides a user interface for creating, monitoring, and managing visa appointment bots, as well as viewing successful appointments.

## Features

- **Bot Management**: Create, monitor, start, stop, and delete visa appointment bots
- **Appointment Tracking**: View and manage appointments found by bots
- **Real-time Logging**: View bot activity logs in real-time
- **Statistics**: View bot performance statistics and appointment metrics
- **User Management**: Role-based access control for administrators and users

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui (Radix UI components with Tailwind CSS)
- **State Management**: React Hooks
- **API Integration**: RESTful API with OpenAPI specification

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_AUTOMATION_API_URL=https://api.example.com
NEXT_PUBLIC_API_KEY=your_api_key_here
```

A template `.env.example` file is provided as a reference.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/visa-bot-admin.git
cd visa-bot-admin
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL and key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages
  - `/appointments`: Appointment management routes
  - `/bots`: Bot management routes
  - `/dashboard`: Dashboard overview
  - `/logs`: System logs
  - `/statistics`: Statistics and analytics
  - `/settings`: System settings
  - `/users`: User management
- `/components`: Reusable React components
- `/lib`: Utility functions and shared logic
  - `/api`: API integration handlers
  - `/api-client.ts`: API client implementation
  - `/auth.ts`: Authentication utilities
- `/public`: Static assets
- `/styles`: Global styles

## Feature Implementation

The project is organized by feature modules:

1. **API Integration**
   - OpenAPI specification is used to generate API client
   - API endpoints are grouped by functional area

2. **Bot Management**
   - Create bots with email and password for visa appointment systems
   - Configure bot parameters (country, facility, date range)
   - Start/stop/restart bots
   - View real-time bot logs

3. **Appointment Management**
   - View all appointments found by bots
   - Confirm or cancel appointments
   - Export appointment data

4. **Statistics & Analytics**
   - Summary dashboard with key metrics
   - Bot performance statistics
   - Appointment success rates by country and facility

## Development Workflow

### Branch Structure

We follow GitFlow for branch management:

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Hotfix branches

### Feature Development

1. Create a feature branch from `develop`:
```bash
git checkout -b feature/new-feature
```

2. Implement and test your changes

3. Commit your changes:
```bash
git add .
git commit -m "Add new feature"
```

4. Push to remote repository:
```bash
git push origin feature/new-feature
```

5. Create a pull request to merge into `develop`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
