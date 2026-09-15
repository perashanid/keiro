# Keiro

**Intelligent outreach automation platform for B2B sales teams.**

Keiro helps sales teams discover companies, build targeted lists, and run personalized email campaigns—all from one unified platform.

https://github.com/user-attachments/assets/brag.mp4

## Features

- 🎯 **Smart Discovery** - Find and qualify companies using Google Places integration
- 👥 **Contact Management** - Organize people and companies with a powerful CRM
- 📧 **Email Campaigns** - Build multi-step sequences with Gmail integration
- 📊 **Analytics Dashboard** - Track campaign performance and engagement metrics
- 🔗 **List Management** - Create and manage targeted prospect lists
- ⚡ **Automation** - Set up intelligent workflows to streamline outreach

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Auth:** Google OAuth 2.0
- **Email:** Gmail API integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud project with Gmail API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/keiro.git
cd keiro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_PLACES_API_KEY="your-places-api-key"
```

4. Initialize the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/       # React components
│   ├── ui/          # Base UI components
│   ├── app/         # Application layout components
│   ├── marketing/   # Landing page components
│   └── [features]/  # Feature-specific components
├── lib/             # Utilities and business logic
│   ├── server/      # Server-side database access
│   ├── store/       # Zustand state stores
│   ├── providers/   # External API integrations
│   └── mock/        # Mock data for development
└── hooks/           # Custom React hooks
```

## License

MIT
