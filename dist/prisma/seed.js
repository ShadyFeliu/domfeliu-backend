import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    const email = process.env['ADMIN_EMAIL'];
    const password = process.env['ADMIN_PASSWORD'];
    if (!email || !password) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in the .env file');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: { email, password: hashedPassword },
    });
    console.log(`✅ Admin user created/updated: ${admin.email}`);
    const trackCount = await prisma.track.count();
    if (trackCount === 0) {
        const tracksFile = await fs.readFile(path.join(__dirname, 'data/tracks.json'), 'utf8');
        const tracks = JSON.parse(tracksFile);
        await prisma.track.createMany({ data: tracks });
        console.log('✅ Sample tracks created');
    }
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
        const eventsFile = await fs.readFile(path.join(__dirname, 'data/events.json'), 'utf8');
        const eventsData = JSON.parse(eventsFile);
        const futureDate1 = new Date();
        futureDate1.setMonth(futureDate1.getMonth() + 1);
        const futureDate2 = new Date();
        futureDate2.setMonth(futureDate2.getMonth() + 2);
        const events = eventsData.map((e, i) => ({
            ...e,
            date: i === 0 ? futureDate1 : futureDate2,
        }));
        await prisma.event.createMany({
            data: events,
        });
        console.log('✅ Sample events created');
    }
    const venueCount = await prisma.venue.count();
    if (venueCount === 0) {
        const venuesFile = await fs.readFile(path.join(__dirname, 'data/venues.json'), 'utf8');
        const venues = JSON.parse(venuesFile);
        await prisma.venue.createMany({ data: venues });
        console.log('✅ Initial venues seeded');
    }
    console.log('🎉 Seed completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    void prisma.$disconnect();
    void pool.end();
});
//# sourceMappingURL=seed.js.map