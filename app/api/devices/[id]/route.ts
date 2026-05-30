import { updateDevice } from "@/lib/deviceService";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  try {
    const device = await updateDevice(params.id, { status: body.status });
    return Response.json(device, { status: 200 });
  } catch (error: any) {
    // Prisma: record not found
    if (error.code === "P2025") {
      return Response.json({ error: "Device not found" }, { status: 404 });
    }
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}