import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all eventos
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: {
        fecha: "desc", // Más reciente primero
      },
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error("Error fetching eventos:", error);
    return NextResponse.json(
      { message: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

// POST create new evento
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fecha, titulo, lugar, descripcion, imagenes } = body;

    // Validate required fields
    if (!fecha || !titulo || !lugar || !descripcion) {
      return NextResponse.json(
        { message: "Fecha, título, lugar y descripción son requeridos" },
        { status: 400 }
      );
    }

    // Create evento
    const evento = await prisma.evento.create({
      data: {
        fecha: new Date(fecha),
        titulo,
        lugar,
        descripcion,
        imagenes: imagenes || [],
      },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error("Error creating evento:", error);
    return NextResponse.json(
      { message: "Error al crear evento" },
      { status: 500 }
    );
  }
}
