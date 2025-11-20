"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useCallback, useRef, useEffect } from "react";

interface RichTextEditorWithImagesProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditorWithImages({ content, onChange }: RichTextEditorWithImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none p-4 min-h-[400px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  }, []);

  // Sincronizar contenido cuando cambia desde fuera
  const updateContent = useCallback(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  // Usar setTimeout para evitar bucles infinitos
  useEffect(() => {
    const timer = setTimeout(updateContent, 0);
    return () => clearTimeout(timer);
  }, [updateContent]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (editor) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } else {
        alert("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-foreground/20 rounded-lg overflow-hidden">
      <div className="flex gap-1 p-3 border-b border-foreground/20 flex-wrap bg-foreground/5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("underline")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          <u>U</u>
        </button>

        <div className="w-px h-6 bg-foreground/20 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("heading", { level: 3 })
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-foreground/20 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          1. Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive("blockquote")
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          &quot; Cita
        </button>

        <div className="w-px h-6 bg-foreground/20 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1.5 rounded text-sm font-medium bg-foreground/10 hover:bg-foreground/20 transition-colors"
        >
          ──
        </button>
        <button
          type="button"
          onClick={triggerImageUpload}
          className="px-3 py-1.5 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          📷 Imagen
        </button>

        <div className="w-px h-6 bg-foreground/20 mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }))
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          ↰ Izq
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'center' })
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          ↔ Centro
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'right' })
              ? "bg-blue-600 text-white"
              : "bg-foreground/10 hover:bg-foreground/20"
            }`}
        >
          ↱ Der
        </button>
      </div>
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[400px] max-h-[600px] overflow-y-auto"
        />
        {!editor?.isFocused && editor?.isEmpty && (
          <div className="absolute top-4 left-4 text-foreground/40 pointer-events-none">
            Escribe tu currículum aquí...
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}