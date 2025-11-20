"use client";

import { useEffect, useState } from "react";
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

interface SeccionPageProps {
  seccion: string;
  titulo: string;
  descripcion: string;
  emoji?: string;
}

export default function SeccionPage({ seccion, titulo, descripcion, emoji = "🎨" }: SeccionPageProps) {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);

  useEffect(() => {
    fetchObras();
  }, [seccion]);

  const fetchObras = async () => {
    try {
      const res = await fetch(`/api/obras?seccion=${seccion}`);
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error("Error fetching obras:", error);
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

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm hover:underline mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold mb-2">{titulo}</h1>
          <p className="text-lg opacity-70">{descripcion}</p>
        </div>

        {obras.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p>No hay obras en esta sección aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {obras.map((obra) => (
              <div
                key={obra.id}
                onClick={() => setSelectedObra(obra)}
                className="cursor-pointer group"
              >
                <div className="relative h-80 bg-foreground/10 rounded-lg overflow-hidden mb-4">
                  {obra.imagenes.length > 0 ? (
                    <Image
                      src={obra.imagenes[0]}
                      alt={obra.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">{emoji}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold group-hover:opacity-70 transition-opacity">
                  {obra.nombre}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedObra && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedObra(null)}
        >
          <div
            className="bg-background border border-foreground/20 rounded-lg max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold">{selectedObra.nombre}</h2>
                <button
                  onClick={() => setSelectedObra(null)}
                  className="text-2xl hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </div>

              {/* Galería de imágenes */}
              {selectedObra.imagenes.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedObra.imagenes.map((imagen, index) => (
                    <div key={index} className="relative h-96">
                      <Image
                        src={imagen}
                        alt={`${selectedObra.nombre} - ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Detalle */}
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedObra.detalle }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
