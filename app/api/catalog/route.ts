import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener todas las obras organizadas por sección
    const obrasFormasVolumenes = await prisma.obra.findMany({
      where: { seccion: "formas-volumenes" },
      orderBy: { createdAt: "desc" }
    });

    const obrasCosmos = await prisma.obra.findMany({
      where: { seccion: "cosmos" },
      orderBy: { createdAt: "desc" }
    });

    const obrasPinturas = await prisma.obra.findMany({
      where: { seccion: "pinturas" },
      orderBy: { createdAt: "desc" }
    });

    const obrasOnagua = await prisma.obra.findMany({
      where: { seccion: "onagua" },
      orderBy: { createdAt: "desc" }
    });

    const obrasTrabajosEspeciales = await prisma.obra.findMany({
      where: { seccion: "trabajos-especiales" },
      orderBy: { createdAt: "desc" }
    });

    const obrasProcesos = await prisma.obra.findMany({
      where: { seccion: "procesos" },
      orderBy: { createdAt: "desc" }
    });

    // Obtener el currículum
    const curriculum = await prisma.curriculum.findFirst({
      orderBy: { updatedAt: "desc" }
    });

    const catalogData = {
      curriculum,
      obras: {
        "formas-volumenes": obrasFormasVolumenes,
        "cosmos": obrasCosmos,
        "pinturas": obrasPinturas,
        "onagua": obrasOnagua,
        "trabajos-especiales": obrasTrabajosEspeciales,
        "procesos": obrasProcesos
      }
    };

    return NextResponse.json(catalogData);
  } catch (error) {
    console.error("Error fetching catalog data:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del catálogo" },
      { status: 500 }
    );
  }
}