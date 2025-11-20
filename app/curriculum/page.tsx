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
            className="prose prose-invert prose-lg max-w-none curriculum-content"
            dangerouslySetInnerHTML={{ __html: curriculum.contenido }}
          />
        </div>
      </div>

      <style jsx global>{`
        .curriculum-content h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .curriculum-content h2 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1.75rem 0 0.75rem 0;
          line-height: 1.3;
        }
        
        .curriculum-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.5rem 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .curriculum-content p {
          margin: 1rem 0;
          line-height: 1.7;
        }
        
        .curriculum-content strong {
          font-weight: bold;
        }
        
        .curriculum-content em {
          font-style: italic;
        }
        
        .curriculum-content u {
          text-decoration: underline;
        }
        
        .curriculum-content ul, .curriculum-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .curriculum-content li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .curriculum-content blockquote {
          border-left: 4px solid #666;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #ccc;
        }
        
        .curriculum-content hr {
          border: none;
          border-top: 2px solid #444;
          margin: 2rem 0;
        }
        
        .curriculum-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .curriculum-content [style*="text-align: center"] {
          text-align: center;
        }
        
        .curriculum-content [style*="text-align: right"] {
          text-align: right;
        }
        
        .curriculum-content [style*="text-align: left"] {
          text-align: left;
        }
      `}</style>
    </div>
  );
}
