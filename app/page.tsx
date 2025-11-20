import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const images = [
    { src: "/images/img01.png", text: "Formas y Volumenes", href: "/formasyvolumenes" },
    { src: "/images/img02.png", text: "Cosmos", href: "/cosmos" },
    { src: "/images/img03.png", text: "Pinturas", href: "/pinturas" },
    { src: "/images/img04.png", text: "OnAgua", href: "/onagua" },
    { src: "/images/img05.png", text: "Trabajos Especiales", href: "/trabajosespeciales" },
    { src: "/images/img06.png", text: "Procesos", href: "/procesos" },
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
              className="relative w-full h-[400px] md:h-[350px] group overflow-hidden border-2 border-transparent hover:border-foreground transition-all duration-300 block"
              aria-label={`View ${item.text}`}
            >
              <Image
                src={item.src}
                alt={item.text}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
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
