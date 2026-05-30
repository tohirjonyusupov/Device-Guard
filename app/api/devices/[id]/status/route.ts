import { updateDevice } from "@/lib/deviceService";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const device = await updateDevice(params.id, { status: body.status });
  return Response.json(device, { status: 201 });
}