import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single evento
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evento = await prisma.evento.findUnique({
      where: { id },
    });

    if (!evento) {
      return NextResponse.json(
        { message: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error("Error fetching evento:", error);
    return NextResponse.json(
      { message: "Error al obtener evento" },
      { status: 500 }
    );
  }
}

// PUT update evento
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fecha, titulo, lugar, descripcion, imagenes } = body;

    // Check if evento exists
    const existingEvento = await prisma.evento.findUnique({
      where: { id },
    });

    if (!existingEvento) {
      return NextResponse.json(
        { message: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Update evento
    const updatedEvento = await prisma.evento.update({
      where: { id },
      data: {
        fecha: fecha ? new Date(fecha) : existingEvento.fecha,
        titulo: titulo || existingEvento.titulo,
        lugar: lugar || existingEvento.lugar,
        descripcion: descripcion || existingEvento.descripcion,
        imagenes: imagenes !== undefined ? imagenes : existingEvento.imagenes,
      },
    });

    return NextResponse.json(updatedEvento);
  } catch (error) {
    console.error("Error updating evento:", error);
    return NextResponse.json(
      { message: "Error al actualizar evento" },
      { status: 500 }
    );
  }
}

// DELETE evento
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if evento exists
    const existingEvento = await prisma.evento.findUnique({
      where: { id },
    });

    if (!existingEvento) {
      return NextResponse.json(
        { message: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Delete evento
    await prisma.evento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting evento:", error);
    return NextResponse.json(
      { message: "Error al eliminar evento" },
      { status: 500 }
    );
  }
}
