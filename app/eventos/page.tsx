"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../components/Spinner";

interface Evento {
  id: string;
  fecha: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  imagenes: string[];
  createdAt: string;
}

export default function EventosPublic() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const res = await fetch("/api/eventos");
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
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

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm hover:underline mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold mb-2">Eventos</h1>
          <p className="text-lg opacity-70">Exposiciones y eventos destacados</p>
        </div>

        {eventos.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p>No hay eventos publicados aún</p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventos.map((evento) => (
              <Link
                key={evento.id}
                href={`/evento/${evento.id}`}
                className="block group"
              >
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg overflow-hidden flex flex-col md:flex-row hover:bg-foreground/10 transition-colors">
                  {evento.imagenes.length > 0 ? (
                    <div className="relative w-full md:w-80 h-64 md:h-auto bg-foreground/10">
                      <Image
                        src={evento.imagenes[0]}
                        alt={evento.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-80 h-64 md:h-auto bg-foreground/10 flex items-center justify-center">
                      <span className="text-6xl">📅</span>
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <p className="text-sm opacity-70 mb-2">
                      {formatDate(evento.fecha)}
                    </p>
                    <h2 className="text-2xl font-bold mb-3 group-hover:opacity-70 transition-opacity">
                      {evento.titulo}
                    </h2>
                    <p className="text-sm opacity-80 mb-4">📍 {evento.lugar}</p>
                    <div
                      className="text-sm opacity-80 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: evento.descripcion }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
