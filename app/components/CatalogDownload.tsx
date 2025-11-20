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

      // Crear contenido HTML para el PDF
      const pdfContent = createPDFContent(catalogData);

      // Crear elemento temporal para renderizar el contenido
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = pdfContent;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "794px"; // A4 width in pixels
      tempDiv.style.padding = "40px";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.color = "black";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.fontSize = "14px";
      tempDiv.style.lineHeight = "1.4";

      document.body.appendChild(tempDiv);

      // Esperar a que las imágenes se carguen
      const images = tempDiv.querySelectorAll("img");
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        });
      }));

      // Generar canvas del contenido
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#ffffff",
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false
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
      const marginTop = 10;
      const usableHeight = pageHeight - marginTop * 2;

      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          canvas.toDataURL("image/png", 0.9),
          "PNG",
          0,
          marginTop,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        position += usableHeight;

        // Agregar máscara blanca para ocultar el contenido que no debe verse en esta página
        if (position < imgHeight) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, marginTop + usableHeight, imgWidth, pageHeight - marginTop - usableHeight, 'F');
        }
      }

      // Remover elemento temporal
      document.body.removeChild(tempDiv);

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
  }; const createPDFContent = (data: CatalogData) => {
    const sections = [
      { key: "formas-volumenes", title: "Formas y Volúmenes" },
      { key: "cosmos", title: "Cosmos" },
      { key: "pinturas", title: "Pinturas" },
      { key: "onagua", title: "Onagua" },
      { key: "trabajos-especiales", title: "Trabajos Especiales" },
      { key: "procesos", title: "Procesos" }
    ];

    const content = `
      <div style="max-width: 100%; color: black; background: white; font-family: Arial, sans-serif;">
        <!-- Portada -->
        <div style="text-align: center; margin-bottom: 60px; padding: 40px 0;">
          <h1 style="font-size: 36px; font-weight: bold; margin: 40px 0 20px 0; color: black; letter-spacing: 2px;">
            CATÁLOGO DE OBRAS
          </h1>
          <h2 style="font-size: 28px; margin: 20px 0 40px 0; color: black; font-weight: normal;">
            David Abt
          </h2>
          <div style="width: 100px; height: 2px; background: black; margin: 20px auto;"></div>
          <p style="font-size: 16px; color: black; margin-top: 30px;">
            ${new Date().getFullYear()}
          </p>
        </div>
        
        <!-- Currículum -->
        ${data.curriculum ? `
          <div style="margin-bottom: 60px; page-break-before: always; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 30px 0; color: black; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
              Currículum
            </h2>
            <div style="width: 80px; height: 2px; background: black; margin: 0 auto 40px auto;"></div>
            
            ${data.curriculum.fotoArtista ? `
              <div style="text-align: center; margin: 40px 0;">
                <img src="${data.curriculum.fotoArtista}" 
                     style="width: 250px; height: 250px; border-radius: 8px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" 
                     alt="Foto del artista" />
              </div>
            ` : ""}
            
            <div style="margin: 30px 0; line-height: 1.8; font-size: 14px; text-align: justify;">
              ${cleanHTMLForPDF(data.curriculum.contenido)}
            </div>
            
            <div style="margin-top: 50px; padding: 25px; border: 2px solid black; background-color: #f8f8f8;">
              <h3 style="font-size: 20px; margin: 0 0 20px 0; color: black; text-align: center; font-weight: bold;">
                DATOS DE CONTACTO
              </h3>
              <div style="text-align: center; font-size: 16px; line-height: 1.6;">
                <p style="margin: 8px 0; color: black;"><strong>WhatsApp:</strong> +54 9 362 456-7700</p>
                <p style="margin: 8px 0; color: black;"><strong>Instagram:</strong> @david.abt1</p>
              </div>
            </div>
          </div>
        ` : ""}
        
        <!-- Obras por Sección -->
        ${Object.keys(data.obras).some(key => data.obras[key].length > 0) ? `
          <div style="page-break-before: always; padding: 20px 0;">
            <h2 style="font-size: 32px; font-weight: bold; margin: 0 0 40px 0; color: black; text-align: center; text-transform: uppercase; letter-spacing: 2px;">
              Obras
            </h2>
            <div style="width: 100px; height: 3px; background: black; margin: 0 auto 50px auto;"></div>
            
            ${sections.filter(section => data.obras[section.key] && data.obras[section.key].length > 0).map(section => {
      const obras = data.obras[section.key];

      return `
                <div style="margin-bottom: 60px; page-break-before: always;">
                  <h3 style="font-size: 24px; font-weight: bold; margin: 20px 0 30px 0; color: black; text-transform: uppercase; text-align: center; letter-spacing: 1px;">
                    ${section.title}
                  </h3>
                  <div style="width: 60px; height: 2px; background: black; margin: 0 auto 40px auto;"></div>
                  
                  ${obras.map((obra, index) => `
                    <div style="margin-bottom: 50px; padding-bottom: 30px; ${index < obras.length - 1 ? 'border-bottom: 1px solid #ccc;' : ''}">
                      <h4 style="font-size: 20px; font-weight: bold; margin: 0 0 20px 0; color: black; text-align: center;">
                        ${obra.nombre}
                      </h4>
                      
                      ${obra.imagenes && obra.imagenes.length > 0 ? `
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 30px 0;">
                          ${obra.imagenes.slice(0, 4).map(img => `
                            <img src="${img}" 
                                 style="width: 300px; height: 300px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" 
                                 alt="${obra.nombre}" />
                          `).join("")}
                          ${obra.imagenes.length > 4 ? `
                            <p style="font-size: 12px; color: #666; text-align: center; width: 100%; margin: 10px 0 0 0;">
                              ... y ${obra.imagenes.length - 4} imagen${obra.imagenes.length - 4 > 1 ? 'es' : ''} más
                            </p>
                          ` : ""}
                        </div>
                      ` : ""}
                      
                      <div style="margin-top: 25px; line-height: 1.7; color: black; font-size: 14px; text-align: justify; max-width: 700px; margin-left: auto; margin-right: auto;">
                        ${cleanHTMLForPDF(obra.detalle)}
                      </div>
                    </div>
                  `).join("")}
                </div>
              `;
    }).join("")}
          </div>
        ` : ""}
      </div>
    `; return content;
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
      📄 Catálogo (PDF)
    </button>
  );
}