"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../../components/Spinner";

interface Evento {
  id: string;
  fecha: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  imagenes: string[];
  createdAt: string;
}

export default function EventoDetail({ params }: { params: Promise<{ id: string }> }) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventoId, setEventoId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setEventoId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId]);

  const fetchEvento = async () => {
    try {
      const res = await fetch(`/api/eventos/${eventoId}`);
      if (res.ok) {
        const data = await res.json();
        setEvento(data);
      } else {
        router.push("/eventos");
      }
    } catch (error) {
      console.error("Error fetching evento:", error);
      router.push("/eventos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <Spinner className="min-h-screen flex items-center justify-center" />;
  }

  if (!evento) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          {" / "}
          <Link href="/eventos" className="hover:underline">
            Eventos
          </Link>
          {" / "}
          <span className="opacity-70">{evento.titulo}</span>
        </div>

        {/* Fecha y Lugar */}
        <div className="mb-4">
          <p className="text-lg opacity-70">{formatDate(evento.fecha)}</p>
          <p className="text-lg opacity-70">📍 {evento.lugar}</p>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{evento.titulo}</h1>

        {/* Descripción */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: evento.descripcion }}
        />

        {/* Galería de imágenes */}
        {evento.imagenes.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Galería</h2>
            <div className="grid grid-cols-1 gap-6">
              {evento.imagenes.map((imagen, index) => (
                <div key={index} className="relative w-full h-[600px]">
                  <Image
                    src={imagen}
                    alt={`${evento.titulo} - Imagen ${index + 1}`}
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
            href="/eventos"
            className="inline-block px-6 py-3 border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
          >
            ← Volver a Eventos
          </Link>
        </div>
      </div>
    </div>
  );
}
