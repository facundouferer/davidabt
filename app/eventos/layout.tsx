import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Exposiciones y eventos destacados de David Abt, escultor y artista plástico chaqueño. Descubre las próximas exposiciones y eventos pasados.",
  openGraph: {
    title: "Eventos | David Abt",
    description: "Exposiciones y eventos destacados de David Abt, escultor y artista plástico chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
