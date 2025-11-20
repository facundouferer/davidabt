"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RichTextEditorWithImages from "@/app/components/RichTextEditorWithImages";
import Image from "next/image";

interface Curriculum {
  id: string;
  contenido: string;
  fotoArtista?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCurriculum() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [contenido, setContenido] = useState("");
  const [fotoArtista, setFotoArtista] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchCurriculum();
    }
  }, [status, router]);

  const fetchCurriculum = async () => {
    try {
      const res = await fetch("/api/curriculum");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setCurriculum(data);
          setContenido(data.contenido || "");
          setFotoArtista(data.fotoArtista || null);
        }
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFotoArtista(data.url);
      } else {
        alert("Error al subir la foto");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error al subir la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/curriculum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contenido,
          fotoArtista,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurriculum(data);
        alert("Currículum guardado exitosamente");
      } else {
        alert("Error al guardar el currículum");
      }
    } catch (error) {
      console.error("Error saving curriculum:", error);
      alert("Error al guardar el currículum");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administrar Currículum</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-foreground/10 rounded hover:bg-foreground/20 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="space-y-8">
          {/* Foto del Artista */}
          <div className="bg-foreground/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Fotografía del Artista</h2>

            <div className="space-y-4">
              {fotoArtista && (
                <div className="relative w-48 h-48 mx-auto">
                  <Image
                    src={fotoArtista}
                    alt="Foto del artista"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    {uploadingPhoto ? "Subiendo..." : fotoArtista ? "Cambiar Foto" : "Subir Foto"}
                  </span>
                </label>
              </div>

              {fotoArtista && (
                <div className="text-center">
                  <button
                    onClick={() => setFotoArtista(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Eliminar Foto
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contenido del Currículum */}
          <div className="bg-foreground/5 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contenido del Currículum</h2>
            <p className="text-sm text-foreground/70 mb-4">
              Utiliza el editor de texto enriquecido para crear tu currículum. Puedes formatear el texto,
              agregar títulos, listas, citas y también insertar imágenes en cualquier parte del contenido.
            </p>

            <RichTextEditorWithImages
              content={contenido}
              onChange={setContenido}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/curriculum")}
              className="px-6 py-2 bg-foreground/10 rounded hover:bg-foreground/20 transition-colors"
            >
              Vista Previa
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Currículum"}
            </button>
          </div>

          {curriculum && (
            <div className="text-sm text-foreground/60 text-center">
              Última actualización: {new Date(curriculum.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}