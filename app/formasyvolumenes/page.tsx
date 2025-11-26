import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formas y Volumenes",
  description: "Exploración de formas tridimensionales y volúmenes escultóricos por David Abt, escultor chaqueño. Obras que exploran el volumen, la fantasía y lo simbólico con un fuerte anclaje en el territorio del Gran Chaco.",
  openGraph: {
    title: "Formas y Volumenes | David Abt",
    description: "Exploración de formas tridimensionales y volúmenes escultóricos por David Abt, escultor chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function FormasYVolumenes() {
  return (
    <SeccionPage
      seccion="formas-volumenes"
      titulo="Formas y Volumenes"
      descripcion="Exploración de formas tridimensionales y volúmenes escultóricos"
      emoji="🗿"
    />
  );
}
