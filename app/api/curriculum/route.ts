import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const curriculum = await prisma.curriculum.findFirst({
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return NextResponse.json(
      { error: "Error al obtener el currículum" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { contenido, fotoArtista } = await request.json();

    // Check if curriculum already exists
    const existingCurriculum = await prisma.curriculum.findFirst();

    let curriculum;

    if (existingCurriculum) {
      // Update existing curriculum
      curriculum = await prisma.curriculum.update({
        where: {
          id: existingCurriculum.id
        },
        data: {
          contenido,
          fotoArtista
        }
      });
    } else {
      // Create new curriculum
      curriculum = await prisma.curriculum.create({
        data: {
          contenido,
          fotoArtista
        }
      });
    }

    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Error saving curriculum:", error);
    return NextResponse.json(
      { error: "Error al guardar el currículum" },
      { status: 500 }
    );
  }
}