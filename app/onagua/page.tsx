import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnAgua",
  description: "Obras inspiradas en el elemento agua por David Abt. Esculturas y arte que exploran la fluidez y lo simbólico del agua desde el Gran Chaco.",
  openGraph: {
    title: "OnAgua | David Abt",
    description: "Obras inspiradas en el elemento agua por David Abt, escultor y artista plástico chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function OnAgua() {
  return (
    <SeccionPage
      seccion="onagua"
      titulo="OnAgua"
      descripcion="Obras inspiradas en el elemento agua"
      emoji="💧"
    />
  );
}
