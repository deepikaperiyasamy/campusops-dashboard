import { io } from 'socket.io-client';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
console.log(`Simulation service connecting to ${BACKEND_URL}...`);

const socket = io(BACKEND_URL);

socket.on('connect', () => {
  console.log('Connected to backend via WebSocket (ID:', socket.id, ')');
  
  // Start simulation loops
  setInterval(simulateServerMetrics, 5000);
  setInterval(simulatePowerUsage, 8000);
  setInterval(simulateAlerts, 20000); // Rare alerts
});

socket.on('disconnect', () => {
  console.log('Disconnected from backend');
});

function simulateServerMetrics() {
  const metrics = {
    servers: [
      { id: '1', name: 'Main DB Server', cpu: randomRange(20, 85), ram: randomRange(40, 90), disk: 45, status: 'ONLINE' },
      { id: '2', name: 'Web Server 1', cpu: randomRange(10, 60), ram: randomRange(30, 70), disk: 60, status: 'ONLINE' },
      { id: '3', name: 'Backup Server', cpu: randomRange(0, 5), ram: randomRange(5, 10), disk: 80, status: 'OFFLINE' }
    ],
    timestamp: new Date().toISOString()
  };
  
  console.log('Emitting server metrics...');
  socket.emit('simulate:servers', metrics);
}

function simulatePowerUsage() {
  const power = {
    buildings: [
      { name: 'Engineering Block', consumption: randomRange(400, 600), voltage: randomRange(215, 230) },
      { name: 'Library', consumption: randomRange(100, 250), voltage: randomRange(218, 225) },
      { name: 'Hostel A', consumption: randomRange(800, 1200), voltage: randomRange(210, 220) }
    ],
    timestamp: new Date().toISOString()
  };
  socket.emit('simulate:power', power);
}

function simulateAlerts() {
  const chance = Math.random();
  if (chance > 0.7) {
    const alert = {
      type: chance > 0.9 ? 'CRITICAL' : 'WARNING',
      message: chance > 0.9 ? 'Power outage detected in Hostel B' : 'High CPU usage on Web Server 1',
      source: chance > 0.9 ? 'POWER' : 'SERVER',
      timestamp: new Date().toISOString()
    };
    console.log('Emitting alert:', alert);
    socket.emit('simulate:alert', alert);
  }
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
