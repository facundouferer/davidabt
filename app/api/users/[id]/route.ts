import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PUT update user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, email, password, role, avatarUrl } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Prevent changing admin username
    if (existingUser.username === "admin" && username !== "admin") {
      return NextResponse.json(
        { message: "No se puede cambiar el nombre del usuario admin" },
        { status: 400 }
      );
    }

    // Check if new username is taken (if changing username)
    if (username !== existingUser.username) {
      const usernameTaken = await prisma.user.findUnique({
        where: { username },
      });

      if (usernameTaken) {
        return NextResponse.json(
          { message: "El nombre de usuario ya existe" },
          { status: 400 }
        );
      }
    }

    // Check if new email is taken (if changing email)
    if (email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { message: "El email ya está registrado" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      username,
      email,
      role,
    };

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update avatarUrl if provided
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Prevent deleting admin user
    if (existingUser.username === "admin") {
      return NextResponse.json(
        { message: "No se puede eliminar el usuario admin" },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
