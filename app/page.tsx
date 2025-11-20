import Image from "next/image";

export default function Home() {
  const images = [
    "/images/img01.png",
    "/images/img02.png",
    "/images/img03.png",
    "/images/img04.png",
    "/images/img05.png",
    "/images/img06.png",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header with Signature */}
      <header className="w-full flex justify-center py-1">
        <div className="relative w-64 h-24">
          <Image
            src="/images/firma.png"
            alt="David Abt Signature"
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Main Content - Image Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {images.map((src, index) => (
            <button
              key={index}
              className="relative w-full h-[400px] md:h-[350px] group overflow-hidden border-2 border-transparent hover:border-foreground transition-all duration-300"
              aria-label={`View artwork ${index + 1}`}
            >
              <Image
                src={src}
                alt={`Artwork ${index + 1}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
