"use client";

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CatalogData {
  curriculum: {
    id: string;
    contenido: string;
    fotoArtista?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  obras: {
    [key: string]: Array<{
      id: string;
      nombre: string;
      detalle: string;
      imagenes: string[];
      seccion: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

interface CatalogDownloadProps {
  className?: string;
}

export default function CatalogDownload({ className = "" }: CatalogDownloadProps) {

  const generatePDF = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement;
    const originalText = button.textContent;

    try {
      // Mostrar estado de carga
      if (button) {
        button.textContent = "Generando...";
        button.disabled = true;
      }

      // Obtener datos del catálogo
      const response = await fetch("/api/catalog");
      if (!response.ok) {
        throw new Error("Error al obtener datos del catálogo");
      }

      const catalogData: CatalogData = await response.json();

      // Verificar que hay contenido para generar
      const hasContent = catalogData.curriculum ||
        Object.values(catalogData.obras).some(obras => obras.length > 0);

      if (!hasContent) {
        alert("No hay contenido suficiente para generar el catálogo.");
        return;
      }

      // Crear PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      let isFirstPage = true;

      // Agregar portada
      await addCoverPage(pdf, isFirstPage);
      isFirstPage = false;

      // Agregar currículum si existe
      if (catalogData.curriculum) {
        if (!isFirstPage) pdf.addPage();
        await addCurriculumPage(pdf, catalogData.curriculum);
        isFirstPage = false;
      }

      // Agregar obras por sección
      const sections = [
        { key: "formas-volumenes", title: "Formas y Volúmenes" },
        { key: "cosmos", title: "Cosmos" },
        { key: "pinturas", title: "Pinturas" },
        { key: "onagua", title: "Onagua" },
        { key: "trabajos-especiales", title: "Trabajos Especiales" },
        { key: "procesos", title: "Procesos" }
      ];

      for (const section of sections) {
        const obras = catalogData.obras[section.key] || [];
        if (obras.length > 0) {
          if (!isFirstPage) pdf.addPage();
          await addSectionPage(pdf, section.title, obras);
          isFirstPage = false;
        }
      }

      // Descargar PDF
      const fileName = `catalogo-david-abt-${new Date().getFullYear()}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el catálogo. Por favor, intenta nuevamente.");
    } finally {
      // Restaurar estado del botón
      if (button && originalText) {
        button.textContent = originalText;
        button.disabled = false;
      }
    }
  };

  const addCoverPage = async (pdf: jsPDF, isFirstPage: boolean) => {
    const pageWidth = 210;
    const pageHeight = 297;

    // Título principal
    pdf.setFontSize(32);
    pdf.setFont("helvetica", "bold");
    pdf.text("CATÁLOGO DE OBRAS", pageWidth / 2, 80, { align: "center" });

    // Nombre del artista
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "normal");
    pdf.text("David Abt", pageWidth / 2, 120, { align: "center" });

    // Línea decorativa
    pdf.setLineWidth(2);
    pdf.line(80, 140, 130, 140);

    // Año
    pdf.setFontSize(16);
    pdf.text(new Date().getFullYear().toString(), pageWidth / 2, 180, { align: "center" });
  };

  const addCurriculumPage = async (pdf: jsPDF, curriculum: any) => {
    const pageWidth = 210;
    let yPosition = 30;

    // Título
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("CURRÍCULUM", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 20;

    // Línea decorativa
    pdf.setLineWidth(1);
    pdf.line(85, yPosition, 125, yPosition);

    yPosition += 30;

    // Foto del artista (si existe)
    if (curriculum.fotoArtista) {
      try {
        // Crear imagen temporal para obtener dimensiones
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = 150;
              canvas.height = 150;
              ctx?.drawImage(img, 0, 0, 150, 150);

              const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
              pdf.addImage(dataUrl, "JPEG", (pageWidth - 40) / 2, yPosition, 40, 40);
              resolve(null);
            } catch (error) {
              resolve(null); // Continuar sin imagen en caso de error
            }
          };
          img.onerror = () => resolve(null);
          img.src = curriculum.fotoArtista;
        });

        yPosition += 50;
      } catch (error) {
        console.log("Error cargando foto del artista:", error);
      }
    }

    // Contenido del currículum
    const cleanContent = cleanHTMLForText(curriculum.contenido);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    const lines = pdf.splitTextToSize(cleanContent, 170);
    for (let i = 0; i < lines.length && yPosition < 250; i++) {
      pdf.text(lines[i], 20, yPosition);
      yPosition += 6;
    }

    // Datos de contacto
    yPosition = Math.max(yPosition + 20, 220);

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("DATOS DE CONTACTO", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("WhatsApp: +54 9 362 456-7700", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 8;
    pdf.text("Instagram: @david.abt1", pageWidth / 2, yPosition, { align: "center" });
  };

  const addSectionPage = async (pdf: jsPDF, sectionTitle: string, obras: any[]) => {
    const pageWidth = 210;
    let yPosition = 30;

    // Título de la sección
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text(sectionTitle.toUpperCase(), pageWidth / 2, yPosition, { align: "center" });

    yPosition += 20;

    // Línea decorativa
    pdf.setLineWidth(1);
    pdf.line(70, yPosition, 140, yPosition);

    yPosition += 25;

    for (const obra of obras) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      // Nombre de la obra
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(obra.nombre, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Descripción de la obra
      const cleanDescription = cleanHTMLForText(obra.detalle);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const lines = pdf.splitTextToSize(cleanDescription, 170);
      const maxLines = Math.min(lines.length, 8); // Limitar líneas para que quepa

      for (let i = 0; i < maxLines; i++) {
        pdf.text(lines[i], 20, yPosition);
        yPosition += 5;
      }

      yPosition += 15;
    }
  };

  const cleanHTMLForText = (html: string) => {
    if (!html) return "";

    // Remover todas las etiquetas HTML y mantener solo el texto
    return html
      .replace(/<[^>]*>/g, " ") // Remover todas las etiquetas HTML
      .replace(/&nbsp;/g, " ") // Reemplazar espacios no rompibles
      .replace(/&amp;/g, "&") // Reemplazar entidades HTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ") // Reemplazar múltiples espacios por uno solo
      .trim();
  }; return (
    <button
      onClick={generatePDF}
      className={`hover:scale-110 transition-transform duration-200 text-lg hover:[text-shadow:0_0_10px_#ffffff] ${className}`}
    >
      📄 Catálogo (PDF)
    </button>
  );
}