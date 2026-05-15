import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campus.edu' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@campus.edu',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Mock Servers
  const servers = [
    { name: 'Main DB Server', ip: '192.168.1.10', status: 'ONLINE', cpuUsage: 45, ramUsage: 60, diskUsage: 40, uptime: 99999 },
    { name: 'Web Server 1', ip: '192.168.1.11', status: 'ONLINE', cpuUsage: 30, ramUsage: 50, diskUsage: 35, uptime: 88888 },
    { name: 'Backup Server', ip: '192.168.1.12', status: 'OFFLINE', cpuUsage: 0, ramUsage: 0, diskUsage: 80, uptime: 0 },
  ];

  for (const s of servers) {
    await prisma.server.upsert({
      where: { ip: s.ip },
      update: s,
      create: s,
    });
  }

  // Mock Devices
  const devices = [
    { id: 'dev-1', name: 'Lab 1 - PC 01', type: 'LAB_PC', location: 'Engineering Block A', status: 'ONLINE' },
    { id: 'dev-2', name: 'Lab 1 - PC 02', type: 'LAB_PC', location: 'Engineering Block A', status: 'OFFLINE' },
    { id: 'dev-3', name: 'Main Gate Attendance', type: 'ATTENDANCE_MACHINE', location: 'Main Entrance', status: 'ONLINE' },
  ];

  for (const d of devices) {
    await prisma.device.upsert({
      where: { id: d.id },
      update: d,
      create: d,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
