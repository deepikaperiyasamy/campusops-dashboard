# Smart Campus Monitoring System API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Health Check
- **URL:** `/health`
- **Method:** `GET`
- **Description:** Returns the current health status of the backend API.
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-05-15T08:00:00.000Z"
  }
  ```

*(Note: Real-time data streams through WebSockets via Socket.IO. Standard CRUD APIs can be added here following typical REST patterns. Refer to the Prisma schema for available data entities: User, Server, Device, Alert, PowerMetric).*

## WebSockets (Socket.IO)

- **Connection URL:** `http://localhost:5000`

### Client Emits (To join rooms)
- `join_dashboard`: Connects the client to the 'dashboard' broadcast room.

### Client Listens (From server)
- `dashboard:servers`: Array of real-time server metrics.
- `dashboard:power`: Real-time campus power usage and voltage metrics.
- `dashboard:alert`: Real-time emergency or system alerts.
