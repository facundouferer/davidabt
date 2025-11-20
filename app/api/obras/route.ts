import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all obras
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seccion = searchParams.get("seccion");

    const where = seccion ? { seccion } : {};

    const obras = await prisma.obra.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(obras);
  } catch (error) {
    console.error("Error fetching obras:", error);
    return NextResponse.json(
      { message: "Error al obtener obras" },
      { status: 500 }
    );
  }
}

// POST create new obra
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, detalle, imagenes, seccion } = body;

    // Validate required fields
    if (!nombre || !detalle || !seccion) {
      return NextResponse.json(
        { message: "Nombre, detalle y sección son requeridos" },
        { status: 400 }
      );
    }

    // Validate seccion
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

    // Create obra
    const obra = await prisma.obra.create({
      data: {
        nombre,
        detalle,
        imagenes: imagenes || [],
        seccion,
      },
    });

    return NextResponse.json(obra, { status: 201 });
  } catch (error) {
    console.error("Error creating obra:", error);
    return NextResponse.json(
      { message: "Error al crear obra" },
      { status: 500 }
    );
  }
}
