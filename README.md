# Smart Campus Infrastructure Monitoring System

A complete full-stack enterprise platform for real-time monitoring of campus infrastructure, including servers, computer labs, attendance devices, power usage, and emergency alerts.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Recharts, Socket.IO Client
- **Backend:** Node.js, Express.js, Prisma ORM, Socket.IO
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose, GitHub Actions

## Features
- **Real-Time Monitoring:** Uses WebSockets (Socket.IO) to push live metrics (CPU, RAM, Power Consumption) directly to the dashboard.
- **Dynamic Dashboard:** Built with Tailwind CSS and Recharts for a modern, responsive UI supporting both light and dark modes.
- **Simulation Service:** A dedicated microservice that generates mock telemetry data to simulate active IoT devices and servers across the campus.
- **Enterprise-Ready:** Complete with CI/CD GitHub Actions workflows, Docker support, and robust folder structuring.

## Local Setup & Development

### Prerequisites
- Docker and Docker Compose installed.
- (Optional) Node.js 20+ if you want to run services outside of Docker.

### Running with Docker Compose (Recommended)
This is the easiest way to run the entire stack (Database, Backend, Frontend, and Simulation Service) simultaneously.

1. Clone the repository.
2. Run the following command at the root of the project:
   ```bash
   docker-compose up -d --build
   ```
3. The services will be available at:
   - **Frontend Dashboard:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000`

### Running Manually

**1. Database**
Ensure you have a PostgreSQL instance running on `localhost:5432` with a database named `smart_campus` and user/password `postgres`/`postgres`.

**2. Backend**
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm start
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Simulation Service**
```bash
cd simulation
npm install
npm start
```

## Folder Structure
- `/backend`: Node.js Express server, Prisma schema, and REST/WebSocket APIs.
- `/frontend`: Vite React frontend, Tailwind CSS configurations, components, and pages.
- `/simulation`: Lightweight Node.js script generating mock telemetry data.
- `/.github`: CI/CD workflows.
