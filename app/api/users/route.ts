import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, role, avatarUrl } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El nombre de usuario ya existe" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "user",
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
