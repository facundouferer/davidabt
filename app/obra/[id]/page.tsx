"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Obra {
  id: string;
  nombre: string;
  detalle: string;
  imagenes: string[];
  seccion: string;
  createdAt: string;
}

const SECCIONES = {
  "formas-volumenes": { label: "Formas y Volumenes", path: "/formasyvolumenes" },
  "cosmos": { label: "Cosmos", path: "/cosmos" },
  "pinturas": { label: "Pinturas", path: "/pinturas" },
  "onagua": { label: "OnAgua", path: "/onagua" },
  "trabajos-especiales": { label: "Trabajos Especiales", path: "/trabajosespeciales" },
  "procesos": { label: "Procesos", path: "/procesos" },
};

export default function ObraDetail({ params }: { params: Promise<{ id: string }> }) {
  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(true);
  const [obraId, setObraId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setObraId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (obraId) {
      fetchObra();
    }
  }, [obraId]);

  const fetchObra = async () => {
    try {
      const res = await fetch(`/api/obras/${obraId}`);
      if (res.ok) {
        const data = await res.json();
        setObra(data);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching obra:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!obra) {
    return null;
  }

  const seccionInfo = SECCIONES[obra.seccion as keyof typeof SECCIONES];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          {" / "}
          <Link href={seccionInfo?.path || "/"} className="hover:underline">
            {seccionInfo?.label || "Obras"}
          </Link>
          {" / "}
          <span className="opacity-70">{obra.nombre}</span>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{obra.nombre}</h1>

        {/* Sección */}
        <p className="text-lg opacity-70 mb-8">
          {seccionInfo?.label || obra.seccion}
        </p>

        {/* Detalle (texto enriquecido) */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: obra.detalle }}
        />

        {/* Galería de imágenes */}
        {obra.imagenes.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Galería</h2>
            <div className="grid grid-cols-1 gap-6">
              {obra.imagenes.map((imagen, index) => (
                <div key={index} className="relative w-full h-[600px]">
                  <Image
                    src={imagen}
                    alt={`${obra.nombre} - Imagen ${index + 1}`}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón volver */}
        <div className="mt-12 pt-8 border-t border-foreground/20">
          <Link
            href={seccionInfo?.path || "/"}
            className="inline-block px-6 py-3 border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
          >
            ← Volver a {seccionInfo?.label || "Obras"}
          </Link>
        </div>
      </div>
    </div>
  );
}
