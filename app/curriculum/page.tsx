"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Curriculum {
  id: string;
  contenido: string;
  fotoArtista?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Curriculum() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const res = await fetch("/api/curriculum");
      if (res.ok) {
        const data = await res.json();
        setCurriculum(data);
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Currículum</h1>
        <p className="text-lg text-foreground/70">No hay contenido disponible aún.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Currículum</h1>

          {curriculum.fotoArtista && (
            <div className="flex justify-center mb-12">
              <div className="relative w-64 h-64">
                <Image
                  src={curriculum.fotoArtista}
                  alt="Foto del artista"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: curriculum.contenido }}
          />
        </div>
      </div>
    </div>
  );
}
