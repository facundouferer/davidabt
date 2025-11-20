"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    } else if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Error al crear usuario");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error al crear usuario");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingUser(null);
        setFormData({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (username === "admin") {
      alert("No se puede eliminar el usuario admin");
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el usuario ${username}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.message || "Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowEditModal(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-sm opacity-70 mt-1">
              Bienvenido, {session?.user?.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 border border-foreground/20 rounded hover:bg-foreground/10 transition-colors"
            >
              Volver al sitio
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              + Crear Usuario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/20">
                  <th className="text-left py-3 px-4">Usuario</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Rol</th>
                  <th className="text-left py-3 px-4">Fecha de Creación</th>
                  <th className="text-right py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-foreground/10 hover:bg-foreground/5"
                  >
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-gray-500/20 text-gray-500"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 text-sm border border-foreground/20 rounded hover:bg-foreground/10 transition-colors mr-2"
                      >
                        Editar
                      </button>
                      {user.username !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="px-3 py-1 text-sm bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-foreground text-background rounded hover:opacity-90"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ username: "", email: "", password: "", role: "user" });
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

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background border border-foreground/20 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  disabled={editingUser.username === "admin"}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nueva Contraseña (dejar vacío para no cambiar)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border border-foreground/20 rounded bg-background focus:outline-none focus:border-foreground"
                  disabled={editingUser.username === "admin"}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-foreground text-background rounded hover:opacity-90"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setFormData({ username: "", email: "", password: "", role: "user" });
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
