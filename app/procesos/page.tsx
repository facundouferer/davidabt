import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procesos",
  description: "El proceso creativo detrás de las obras de David Abt. Descubre cómo se crean las esculturas y obras de arte desde el Gran Chaco.",
  openGraph: {
    title: "Procesos | David Abt",
    description: "El proceso creativo detrás de las obras de David Abt, escultor y artista plástico chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function Procesos() {
  return (
    <SeccionPage
      seccion="procesos"
      titulo="Procesos"
      descripcion="El proceso creativo detrás de las obras"
      emoji="🔨"
    />
  );
}
