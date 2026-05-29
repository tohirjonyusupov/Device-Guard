import { promises as fs } from 'fs';
import path from 'path';
import { globalDeviceDatabase } from '@/data/mockData';
import { DatabaseShape, StoredDevice } from './types';

const dbPath = path.join(process.cwd(), 'data', 'backend-db.json');

function seedDatabase(): DatabaseShape {
  const now = new Date().toISOString();
  const devices: StoredDevice[] = globalDeviceDatabase.map((device) => ({
    ...device,
    ownerId: 'seed-user',
    updatedAt: now,
  }));

  return {
    users: [],
    devices,
  };
}

export async function readDb(): Promise<DatabaseShape> {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw) as DatabaseShape;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') throw error;

    const initial = seedDatabase();
    await writeDb(initial);
    return initial;
  }
}

export async function writeDb(db: DatabaseShape) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
}
