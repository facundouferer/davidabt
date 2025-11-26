import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const images = [
    { src: "/images/formas_y_volumenes.jpeg", text: "Formas y Volumenes", href: "/formasyvolumenes" },
    { src: "/images/cosmos.jpeg", text: "Cosmos", href: "/cosmos" },
    { src: "/images/pinturas.jpeg", text: "Pinturas", href: "/pinturas" },
    { src: "/images/on_agua.jpeg", text: "OnAgua", href: "/onagua" },
    { src: "/images/trabajos_especiales.jpeg", text: "Trabajos Especiales", href: "/trabajosespeciales" },
    { src: "/images/procesos.jpeg", text: "Procesos", href: "/procesos" },
  ];

  return (
    <>
      {/* Main Content - Image Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {images.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative w-full h-[400px] md:h-[350px] group overflow-hidden border-2 border-transparent  transition-all duration-300 block"
              aria-label={`View ${item.text}`}
            >
              <Image
                src={item.src}
                alt={item.text}
                fill
                className="object-cover hover:blur-xl transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white text-3xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] shadow-black uppercase tracking-wider text-center px-4">
                  {item.text}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
