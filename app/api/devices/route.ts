import { createDevice, getAllDevices } from "@/lib/deviceService";

export async function GET() {
  const devices = await getAllDevices();
  return Response.json(devices);
}

export async function POST(req: Request) {
  const body = await req.json();
  const device = await createDevice(body);
  return Response.json(device, { status: 201 });
}