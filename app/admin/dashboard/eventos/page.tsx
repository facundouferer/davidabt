"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "../../../components/Spinner";
import RichTextEditor from "@/app/components/RichTextEditor";

interface Evento {
  id: string;
  fecha: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  imagenes: string[];
  createdAt: string;
}

export default function EventosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fecha: "",
    titulo: "",
    lugar: "",
    descripcion: "",
    imagenes: [] as string[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchEventos();
    }
  }, [status, router]);

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

  const handleCreateEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({
          fecha: "",
          titulo: "",
          lugar: "",
          descripcion: "",
          imagenes: [],
        });
        fetchEventos();
      } else {
        const error = await res.json();
        alert(error.message || "Error al crear evento");
      }
    } catch (error) {
      console.error("Error creating evento:", error);
      alert("Error al crear evento");
    }
  };

  const handleUpdateEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvento) return;

    try {
      const res = await fetch(`/api/eventos/${editingEvento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingEvento(null);
        setFormData({
          fecha: "",
          titulo: "",
          lugar: "",
          descripcion: "",
          imagenes: [],
        });
        fetchEventos();
      } else {
        const error = await res.json();
        alert(error.message || "Error al actualizar evento");
      }
    } catch (error) {
      console.error("Error updating evento:", error);
      alert("Error al actualizar evento");
    }
  };

  const handleDeleteEvento = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de eliminar el evento "${titulo}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/eventos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchEventos();
      } else {
        const error = await res.json();
        alert(error.message || "Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error deleting evento:", error);
      alert("Error al eliminar evento");
    }
  };

  const openEditModal = (evento: Evento) => {
    setEditingEvento(evento);
    const fechaFormatted = new Date(evento.fecha).toISOString().split("T")[0];
    setFormData({
      fecha: fechaFormatted,
      titulo: evento.titulo,
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      imagenes: evento.imagenes,
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return <Spinner className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
            <p className="text-sm opacity-70 mt-1">
              Administra los eventos del portafolio
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
              + Crear Evento
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-foreground/5 border border-foreground/10 rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              {evento.imagenes.length > 0 ? (
                <div className="relative w-full md:w-64 h-48 md:h-auto bg-foreground/10">
                  <Image
                    src={evento.imagenes[0]}
                    alt={evento.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-64 h-48 md:h-auto bg-foreground/10 flex items-center justify-center">
                  <span className="text-4xl">📅</span>
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm opacity-70 mb-1">
                      {formatDate(evento.fecha)}
                    </p>
                    <h3 className="text-2xl font-bold mb-2">{evento.titulo}</h3>
                    <p className="text-sm opacity-80 mb-2">📍 {evento.lugar}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(evento)}
                      className="px-3 py-1 text-sm border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEvento(evento.id, evento.titulo)}
                      className="px-3 py-1 text-sm bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div
                  className="text-sm opacity-80 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: evento.descripcion }}
                />
              </div>
            </div>
          ))}
        </div>

        {eventos.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p>No hay eventos creados aún</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-3xl my-8">
            <h2 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h2>
            <form onSubmit={handleCreateEvento} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lugar</label>
                  <input
                    type="text"
                    value={formData.lugar}
                    onChange={(e) =>
                      setFormData({ ...formData, lugar: e.target.value })
                    }
                    className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <RichTextEditor
                  content={formData.descripcion}
                  onChange={(content) =>
                    setFormData({ ...formData, descripcion: content })
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
                      fecha: "",
                      titulo: "",
                      lugar: "",
                      descripcion: "",
                      imagenes: [],
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
      {showEditModal && editingEvento && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-3xl my-8">
            <h2 className="text-2xl font-bold mb-4">Editar Evento</h2>
            <form onSubmit={handleUpdateEvento} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lugar</label>
                  <input
                    type="text"
                    value={formData.lugar}
                    onChange={(e) =>
                      setFormData({ ...formData, lugar: e.target.value })
                    }
                    className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <RichTextEditor
                  content={formData.descripcion}
                  onChange={(content) =>
                    setFormData({ ...formData, descripcion: content })
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
                    setEditingEvento(null);
                    setFormData({
                      fecha: "",
                      titulo: "",
                      lugar: "",
                      descripcion: "",
                      imagenes: [],
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
