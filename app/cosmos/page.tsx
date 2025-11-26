import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmos",
  description: "Exploraciones del universo y lo celestial por David Abt. Obras escultóricas y artísticas que exploran el cosmos y lo simbólico desde el Gran Chaco.",
  openGraph: {
    title: "Cosmos | David Abt",
    description: "Exploraciones del universo y lo celestial por David Abt, escultor chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function Cosmos() {
  return (
    <SeccionPage
      seccion="cosmos"
      titulo="Cosmos"
      descripcion="Exploraciones del universo y lo celestial"
      emoji="🌌"
    />
  );
}
