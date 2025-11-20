import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single obra
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const obra = await prisma.obra.findUnique({
      where: { id },
    });

    if (!obra) {
      return NextResponse.json(
        { message: "Obra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(obra);
  } catch (error) {
    console.error("Error fetching obra:", error);
    return NextResponse.json(
      { message: "Error al obtener obra" },
      { status: 500 }
    );
  }
}

// PUT update obra
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, detalle, imagenes, seccion } = body;

    // Check if obra exists
    const existingObra = await prisma.obra.findUnique({
      where: { id },
    });

    if (!existingObra) {
      return NextResponse.json(
        { message: "Obra no encontrada" },
        { status: 404 }
      );
    }

    // Validate seccion if provided
    if (seccion) {
      const validSecciones = [
        "formas-volumenes",
        "cosmos",
        "pinturas",
        "onagua",
        "trabajos-especiales",
        "procesos",
      ];

      if (!validSecciones.includes(seccion)) {
        return NextResponse.json(
          { message: "Sección inválida" },
          { status: 400 }
        );
      }
    }

    // Update obra
    const updatedObra = await prisma.obra.update({
      where: { id },
      data: {
        nombre: nombre || existingObra.nombre,
        detalle: detalle || existingObra.detalle,
        imagenes: imagenes !== undefined ? imagenes : existingObra.imagenes,
        seccion: seccion || existingObra.seccion,
      },
    });

    return NextResponse.json(updatedObra);
  } catch (error) {
    console.error("Error updating obra:", error);
    return NextResponse.json(
      { message: "Error al actualizar obra" },
      { status: 500 }
    );
  }
}

// DELETE obra
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if obra exists
    const existingObra = await prisma.obra.findUnique({
      where: { id },
    });

    if (!existingObra) {
      return NextResponse.json(
        { message: "Obra no encontrada" },
        { status: 404 }
      );
    }

    // Delete obra
    await prisma.obra.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Obra eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting obra:", error);
    return NextResponse.json(
      { message: "Error al eliminar obra" },
      { status: 500 }
    );
  }
}
