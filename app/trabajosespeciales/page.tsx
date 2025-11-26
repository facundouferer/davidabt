import SeccionPage from "../components/SeccionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trabajos Especiales",
  description: "Proyectos únicos y comisiones especiales de David Abt. Obras escultóricas personalizadas que exploran el volumen y lo simbólico.",
  openGraph: {
    title: "Trabajos Especiales | David Abt",
    description: "Proyectos únicos y comisiones especiales de David Abt, escultor chaqueño.",
    images: ['/images/fotodavidabt.png'],
  },
};


export default function TrabajosEspeciales() {
  return (
    <SeccionPage
      seccion="trabajos-especiales"
      titulo="Trabajos Especiales"
      descripcion="Proyectos únicos y comisiones especiales"
      emoji="⭐"
    />
  );
}
