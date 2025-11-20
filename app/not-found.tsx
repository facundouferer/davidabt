import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h2 className="text-4xl font-bold mb-4">404 - Página no encontrada</h2>
      <p className="mb-8 text-lg">Lo sentimos, la página que buscas no existe.</p>
      <Link
        href="/"
        className="px-6 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
