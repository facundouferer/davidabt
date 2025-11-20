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

  const generatePDF = async () => {
    try {
      // Obtener datos del catálogo
      const response = await fetch("/api/catalog");
      if (!response.ok) {
        throw new Error("Error al obtener datos del catálogo");
      }

      const catalogData: CatalogData = await response.json();

      // Crear contenido HTML para el PDF
      const pdfContent = createPDFContent(catalogData);

      // Crear elemento temporal para renderizar el contenido
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = pdfContent;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm"; // A4 width
      tempDiv.style.padding = "20mm";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.color = "black";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.fontSize = "12px";
      tempDiv.style.lineHeight = "1.4";

      document.body.appendChild(tempDiv);

      // Generar canvas del contenido
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: 794, // A4 width in pixels at 96 DPI
        windowWidth: 794
      });

      // Crear PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      // Si el contenido es más alto que una página, dividirlo
      const pageHeight = 297; // A4 height in mm

      while (position < imgHeight) {
        const remainingHeight = imgHeight - position;
        const currentPageHeight = Math.min(pageHeight - 20, remainingHeight); // 20mm margin

        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          -position,
          imgWidth,
          imgHeight
        );

        position += currentPageHeight;
      }

      // Remover elemento temporal
      document.body.removeChild(tempDiv);

      // Descargar PDF
      pdf.save("catalogo-david-abt.pdf");

    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el catálogo. Por favor, intenta nuevamente.");
    }
  };

  const createPDFContent = (data: CatalogData) => {
    const sections = [
      { key: "formas-volumenes", title: "Formas y Volúmenes" },
      { key: "cosmos", title: "Cosmos" },
      { key: "pinturas", title: "Pinturas" },
      { key: "onagua", title: "Onagua" },
      { key: "trabajos-especiales", title: "Trabajos Especiales" },
      { key: "procesos", title: "Procesos" }
    ];

    const content = `
      <div style="max-width: 100%; color: black; background: white;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 32px; font-weight: bold; margin: 20px 0; color: black;">
            CATÁLOGO DE OBRAS
          </h1>
          <h2 style="font-size: 24px; margin: 10px 0; color: black;">
            David Abt
          </h2>
        </div>
        
        <!-- Currículum -->
        ${data.curriculum ? `
          <div style="margin-bottom: 50px; page-break-after: always;">
            <h2 style="font-size: 24px; font-weight: bold; margin: 30px 0 20px 0; color: black; border-bottom: 2px solid black; padding-bottom: 10px;">
              CURRÍCULUM
            </h2>
            
            ${data.curriculum.fotoArtista ? `
              <div style="text-align: center; margin: 30px 0;">
                <img src="${data.curriculum.fotoArtista}" 
                     style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: cover;" 
                     alt="Foto del artista" />
              </div>
            ` : ""}
            
            <div style="margin: 20px 0; line-height: 1.6;">
              ${cleanHTMLForPDF(data.curriculum.contenido)}
            </div>
            
            <div style="margin-top: 40px; padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
              <h3 style="font-size: 18px; margin-bottom: 15px; color: black;">DATOS DE CONTACTO</h3>
              <p style="margin: 5px 0; color: black;">📱 WhatsApp: +54 9 362 456-7700</p>
              <p style="margin: 5px 0; color: black;">📸 Instagram: @david.abt1</p>
            </div>
          </div>
        ` : ""}
        
        <!-- Obras por Sección -->
        <div style="page-break-before: always;">
          <h2 style="font-size: 28px; font-weight: bold; margin: 30px 0 40px 0; color: black; text-align: center; border-bottom: 3px solid black; padding-bottom: 15px;">
            OBRAS
          </h2>
          
          ${sections.map(section => {
      const obras = data.obras[section.key] || [];
      if (obras.length === 0) return "";

      return `
              <div style="margin-bottom: 50px; page-break-before: always;">
                <h3 style="font-size: 22px; font-weight: bold; margin: 30px 0 20px 0; color: black; text-transform: uppercase; border-bottom: 1px solid black; padding-bottom: 8px;">
                  ${section.title}
                </h3>
                
                ${obras.map(obra => `
                  <div style="margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #ddd;">
                    <h4 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: black;">
                      ${obra.nombre}
                    </h4>
                    
                    ${obra.imagenes && obra.imagenes.length > 0 ? `
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                        ${obra.imagenes.map(img => `
                          <img src="${img}" 
                               style="width: 100%; max-width: 300px; height: auto; border-radius: 4px; object-fit: cover;" 
                               alt="${obra.nombre}" />
                        `).join("")}
                      </div>
                    ` : ""}
                    
                    <div style="margin-top: 15px; line-height: 1.5; color: black;">
                      ${cleanHTMLForPDF(obra.detalle)}
                    </div>
                  </div>
                `).join("")}
              </div>
            `;
    }).join("")}
        </div>
      </div>
    `;

    return content;
  };

  const cleanHTMLForPDF = (html: string) => {
    if (!html) return "";

    // Remover estilos complejos y mantener estructura básica
    return html
      .replace(/<p[^>]*>/gi, "<p style='margin: 10px 0; color: black;'>")
      .replace(/<h1[^>]*>/gi, "<h1 style='font-size: 20px; font-weight: bold; margin: 20px 0 10px 0; color: black;'>")
      .replace(/<h2[^>]*>/gi, "<h2 style='font-size: 18px; font-weight: bold; margin: 18px 0 8px 0; color: black;'>")
      .replace(/<h3[^>]*>/gi, "<h3 style='font-size: 16px; font-weight: bold; margin: 16px 0 6px 0; color: black;'>")
      .replace(/<ul[^>]*>/gi, "<ul style='margin: 10px 0; padding-left: 20px; color: black;'>")
      .replace(/<ol[^>]*>/gi, "<ol style='margin: 10px 0; padding-left: 20px; color: black;'>")
      .replace(/<li[^>]*>/gi, "<li style='margin: 5px 0; color: black;'>")
      .replace(/<blockquote[^>]*>/gi, "<blockquote style='border-left: 3px solid black; padding-left: 15px; margin: 15px 0; font-style: italic; color: black;'>")
      .replace(/<strong[^>]*>/gi, "<strong style='font-weight: bold; color: black;'>")
      .replace(/<em[^>]*>/gi, "<em style='font-style: italic; color: black;'>")
      .replace(/<img[^>]*>/gi, (match) => {
        const src = match.match(/src="([^"]*)"/) ? match.match(/src="([^"]*)"/)![1] : "";
        return `<img src="${src}" style="max-width: 100%; height: auto; margin: 10px auto; display: block; border-radius: 4px;" />`;
      });
  };

  return (
    <button
      onClick={generatePDF}
      className={`hover:scale-110 transition-transform duration-200 text-lg hover:[text-shadow:0_0_10px_#ffffff] ${className}`}
    >
      Descargar Catálogo
    </button>
  );
}