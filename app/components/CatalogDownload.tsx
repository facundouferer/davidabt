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

import { useState } from "react";
import Spinner from "./Spinner";

// ... existing imports

export default function CatalogDownload({ className = "" }: CatalogDownloadProps) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  const cleanHTMLForText = (html: string) => {
    if (typeof window === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const addCoverPage = async (pdf: jsPDF, isFirstPage: boolean) => {
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(20, 20, 20);
    pdf.rect(0, 0, width, height, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(40);
    pdf.text("DAVID ABT", width / 2, height / 2 - 20, { align: "center" });

    pdf.setFontSize(20);
    pdf.text("CATÁLOGO DE OBRAS", width / 2, height / 2 + 10, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(`${new Date().getFullYear()}`, width / 2, height - 20, { align: "center" });
  };

  const addCurriculumPage = async (pdf: jsPDF, curriculum: any) => {
    const width = pdf.internal.pageSize.getWidth();
    const margin = 20;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(24);
    pdf.text("Currículum", margin, margin + 10);

    pdf.setFontSize(12);
    const text = cleanHTMLForText(curriculum.contenido);
    const splitText = pdf.splitTextToSize(text, width - (margin * 2));
    pdf.text(splitText, margin, margin + 30);
  };

  const addSectionPage = async (pdf: jsPDF, title: string, obras: any[]) => {
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Section Title
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, width, height, 'F');

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(30);
    pdf.text(title, width / 2, height / 2, { align: "center" });

    // Obras
    for (const obra of obras) {
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, width, height, 'F');

      let yPos = margin + 10;

      pdf.setFontSize(18);
      pdf.text(obra.nombre, margin, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      const text = cleanHTMLForText(obra.detalle);
      const splitText = pdf.splitTextToSize(text, width - (margin * 2));
      pdf.text(splitText, margin, yPos);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className={`hover:scale-110 transition-transform duration-200 text-lg hover:[text-shadow:0_0_10px_#ffffff] ${className} flex items-center gap-2`}
    >
      {loading ? (
        <>
          <Spinner size={5} className="flex" />
          <span>Generando...</span>
        </>
      ) : (
        <>
          📄 Catálogo (PDF)
        </>
      )}
    </button>
  );
}