import bcrypt from 'bcryptjs';
import { createUser } from "@/lib/deviceService";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // Validation
  if (!body?.fullName || !body?.email || !body?.password) {
    return Response.json({ error: "fullName, email, password required" }, { status: 400 });
  }

  // Password hash
  const passwordHash = await bcrypt.hash(body.password, 10);

  try {
    const user = await createUser({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      passwordHash,
      role: 'user'
    });

    return Response.json({
      message: 'User registered successfully',
      data: { id: user.id, email: user.email }, // passwordHash qaytarmaslik!
    }, { status: 201 });

  } catch (error: any) {
    // Prisma: unique constraint (email takrorlanishi)
    if (error.code === 'P2002') {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}