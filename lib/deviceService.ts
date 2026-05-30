import { globalDeviceDatabase } from "@/data/mockData";
import { prisma } from "./server/db";
import { DeviceCategory, DeviceStatus, UserRole } from "@prisma/client";
import { StoredUser } from "./server/types";

// Seed: agar device yo'q bo'lsa, mockData'dan to'ldiradi
export async function ensureSeeded() {
  const count = await prisma.device.count();
  if (count === 0) {
    await prisma.device.createMany({
      data: globalDeviceDatabase.map((device) => ({
        ...device,
        ownerId: "seed-user",
      })),
      skipDuplicates: true,
    });
  }
}

// Barcha devicelarni olish
export async function getAllDevices() {
  await ensureSeeded();
  return prisma.device.findMany();
}

// Device qo'shish
export async function createDevice(data: {
  name: string;
  type?: string;
  ownerId: string;
  brand: string;
  model: string;
  category: DeviceCategory;
  serialNumber: string;
}) {
  return prisma.device.create({ data });
}

// Device yangilash
export async function updateDevice(
  id: string,
  data: Partial<{
    name: string;
    type: string;
    status: DeviceStatus;
  }>,
) {
  return prisma.device.update({ where: { id }, data });
}

// Device o'chirish
export async function deleteDevice(id: string) {
  return prisma.device.delete({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// User qo'shish uchun yordamchi funksiya
export async function createUser(data: {
  fullName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: UserRole;
}) {
  return prisma.user.create({ data });
}

// Userni email bo'yicha topish
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// Barcha userlarni olish
export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getDeviceByIdAndOwner(id: string, ownerId: string) {
  return prisma.device.findFirst({
    where: { id, ownerId },
  });
}
