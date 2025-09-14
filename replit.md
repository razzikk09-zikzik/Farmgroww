# Overview

FarmGrow is a gamified platform designed to promote sustainable farming practices among farmers in India, particularly Tamil Nadu and Kerala. The application addresses key challenges in agriculture including post-harvest losses, poor storage, labor scarcity, weak market access, chemical overuse, and climate variability. The platform provides an engaging educational experience through micro-lessons, challenges, rewards, market information, and community features designed to encourage adoption of sustainable farming practices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React 18 with TypeScript, providing a modern and type-safe development experience. The application uses a component-based architecture with the following key design decisions:

- **UI Framework**: Utilizes shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: TailwindCSS for utility-first styling with a custom design system featuring rounded corners, soft shadows, and accent colors (green, blue, orange)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

The component structure follows a clear hierarchy with reusable UI components, page components, and specialized components like challenge cards and lesson cards. The mobile-first responsive design includes a dedicated mobile navigation component for optimal smartphone experience.

## Backend Architecture

The backend is built with Express.js and TypeScript using an ESM module structure:

- **Server Framework**: Express.js with middleware for request logging, JSON parsing, and error handling
- **API Design**: RESTful API endpoints organized by feature (dashboard, lessons, challenges, market, rewards)
- **Development Setup**: Hot reloading with tsx for development and esbuild for production compilation
- **Storage Pattern**: Interface-based storage abstraction allowing for easy database implementation switching

The server uses a modular route registration system and implements comprehensive error handling with status codes and JSON responses.

## Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL hosted on Neon Database service
- **ORM**: Drizzle ORM with schema-first approach providing full type safety
- **Schema Design**: Comprehensive schema covering users, lessons, challenges, rewards, market prices, alerts, and leaderboard entries
- **Migrations**: Drizzle Kit for database migrations and schema management

The database schema supports the gamification features with point systems, progress tracking, and user rankings.

## Key Features

The platform implements several core modules:

- **Dashboard**: Centralized view showing user stats, active challenges, recent lessons, market prices, and alerts
- **Micro-Lessons**: Educational content with video placeholders, duration tracking, and point rewards
- **Challenges**: Gamified tasks with progress tracking, deadlines, and proof submission
- **Market Information**: Real-time crop prices and transport request functionality
- **Rewards System**: Point-based rewards including badges, vouchers, and tools
- **Leaderboard**: Community ranking system to encourage participation

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: TypeScript ORM for database operations
- **Drizzle Kit**: Database migration and schema management tools

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API data

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for cartographer and dev banner

## State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **Wouter**: Lightweight routing solution for single-page application navigation

## Additional Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Component variant management
- **CMDK**: Command palette functionality
- **Embla Carousel**: Carousel/slider component functionality