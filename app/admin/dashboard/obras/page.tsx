"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "../../../components/Spinner";
import RichTextEditor from "@/app/components/RichTextEditor";

interface Obra {
  id: string;
  nombre: string;
  detalle: string;
  imagenes: string[];
  seccion: string;
  createdAt: string;
}

const SECCIONES = [
  { value: "formas-volumenes", label: "Formas y Volumenes" },
  { value: "cosmos", label: "Cosmos" },
  { value: "pinturas", label: "Pinturas" },
  { value: "onagua", label: "OnAgua" },
  { value: "trabajos-especiales", label: "Trabajos Especiales" },
  { value: "procesos", label: "Procesos" },
];

export default function ObrasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingObra, setEditingObra] = useState<Obra | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    detalle: "",
    imagenes: [] as string[],
    seccion: "formas-volumenes",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchObras();
    }
  }, [status, router]);

  const fetchObras = async () => {
    try {
      const res = await fetch("/api/obras");
      const data = await res.json();
      setObras(data);
    } catch (error) {
      console.error("Error fetching obras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFormData({
          ...formData,
          imagenes: [...formData.imagenes, url],
        });
      } else {
        const error = await res.json();
        alert(error.message || "Error al subir imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      imagenes: formData.imagenes.filter((_, i) => i !== index),
    });
  };

  const handleCreateObra = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({
          nombre: "",
          detalle: "",
          imagenes: [],
          seccion: "formas-volumenes",
        });
        fetchObras();
      } else {
        const error = await res.json();
        alert(error.message || "Error al crear obra");
      }
    } catch (error) {
      console.error("Error creating obra:", error);
      alert("Error al crear obra");
    }
  };

  const handleUpdateObra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObra) return;

    try {
      const res = await fetch(`/api/obras/${editingObra.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingObra(null);
        setFormData({
          nombre: "",
          detalle: "",
          imagenes: [],
          seccion: "formas-volumenes",
        });
        fetchObras();
      } else {
        const error = await res.json();
        alert(error.message || "Error al actualizar obra");
      }
    } catch (error) {
      console.error("Error updating obra:", error);
      alert("Error al actualizar obra");
    }
  };

  const handleDeleteObra = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la obra "${nombre}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/obras/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchObras();
      } else {
        const error = await res.json();
        alert(error.message || "Error al eliminar obra");
      }
    } catch (error) {
      console.error("Error deleting obra:", error);
      alert("Error al eliminar obra");
    }
  };

  const openEditModal = (obra: Obra) => {
    setEditingObra(obra);
    setFormData({
      nombre: obra.nombre,
      detalle: obra.detalle,
      imagenes: obra.imagenes,
      seccion: obra.seccion,
    });
    setShowEditModal(true);
  };

  if (status === "loading" || loading) {
    return <Spinner className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Obras</h1>
            <p className="text-sm opacity-70 mt-1">
              Administra las obras del portafolio
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
            >
              Volver al Dashboard
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              + Crear Obra
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map((obra) => (
            <div
              key={obra.id}
              className="bg-foreground/5 border border-foreground/10 rounded-lg overflow-hidden"
            >
              {obra.imagenes.length > 0 ? (
                <div className="relative h-48 bg-foreground/10">
                  <Image
                    src={obra.imagenes[0]}
                    alt={obra.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-foreground/10 flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{obra.nombre}</h3>
                <p className="text-sm opacity-70 mb-2">
                  {SECCIONES.find((s) => s.value === obra.seccion)?.label}
                </p>
                <div
                  className="text-sm opacity-80 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: obra.detalle }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(obra)}
                    className="flex-1 px-3 py-2 text-sm border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteObra(obra.id, obra.nombre)}
                    className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {obras.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>No hay obras creadas aún</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-3xl my-8">
            <h2 className="text-2xl font-bold mb-4">Crear Nueva Obra</h2>
            <form onSubmit={handleCreateObra} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sección</label>
                <select
                  value={formData.seccion}
                  onChange={(e) =>
                    setFormData({ ...formData, seccion: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                >
                  {SECCIONES.map((seccion) => (
                    <option key={seccion.value} value={seccion.value}>
                      {seccion.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detalle</label>
                <RichTextEditor
                  content={formData.detalle}
                  onChange={(content) =>
                    setFormData({ ...formData, detalle: content })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Galería de Imágenes
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.imagenes.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="text-sm"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-blue-500 mt-1">Subiendo...</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-foreground text-background rounded hover:opacity-90"
                  disabled={uploadingImage}
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      nombre: "",
                      detalle: "",
                      imagenes: [],
                      seccion: "formas-volumenes",
                    });
                  }}
                  className="flex-1 py-2 border border-foreground/20 rounded hover:bg-foreground/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingObra && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-3xl my-8">
            <h2 className="text-2xl font-bold mb-4">Editar Obra</h2>
            <form onSubmit={handleUpdateObra} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sección</label>
                <select
                  value={formData.seccion}
                  onChange={(e) =>
                    setFormData({ ...formData, seccion: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                >
                  {SECCIONES.map((seccion) => (
                    <option key={seccion.value} value={seccion.value}>
                      {seccion.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detalle</label>
                <RichTextEditor
                  content={formData.detalle}
                  onChange={(content) =>
                    setFormData({ ...formData, detalle: content })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Galería de Imágenes
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.imagenes.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="text-sm"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-blue-500 mt-1">Subiendo...</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-foreground text-background rounded hover:opacity-90"
                  disabled={uploadingImage}
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingObra(null);
                    setFormData({
                      nombre: "",
                      detalle: "",
                      imagenes: [],
                      seccion: "formas-volumenes",
                    });
                  }}
                  className="flex-1 py-2 border border-foreground/20 rounded hover:bg-foreground/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
