import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pinturas",
  description: "Obras pictóricas y expresiones en lienzo de David Abt. Pinturas que exploran la fantasía y lo simbólico con un fuerte anclaje en el territorio del Gran Chaco.",
  openGraph: {
    title: "Pinturas | David Abt",
    description: "Obras pictóricas y expresiones en lienzo de David Abt, artista plástico chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function Pinturas() {
  return (
    <SeccionPage
      seccion="pinturas"
      titulo="Pinturas"
      descripcion="Obras pictóricas y expresiones en lienzo"
      emoji="🖌️"
    />
  );
}
