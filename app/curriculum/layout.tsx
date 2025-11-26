import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "Curriculum vitae de David Abt, escultor y artista plástico chaqueño. Trayectoria, exposiciones, premios y reconocimientos.",
  openGraph: {
    title: "Curriculum | David Abt",
    description: "Curriculum vitae de David Abt, escultor y artista plástico chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};

export default function CurriculumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
