"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef } from "react";

interface RichTextEditorWithImagesProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditorWithImages({ content, onChange }: RichTextEditorWithImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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
    <div className="border border-foreground/20 rounded">
      <div className="flex gap-2 p-2 border-b border-foreground/20 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("bold") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("italic") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("underline") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("heading", { level: 1 }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("heading", { level: 3 }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("bulletList") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("orderedList") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          1. Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive("blockquote") ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          &quot; Cita
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-sm bg-foreground/10"
        >
          ──
        </button>
        <button
          type="button"
          onClick={triggerImageUpload}
          className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          📷 Imagen
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          ⬅
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          ⬛
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? "bg-foreground text-background" : "bg-foreground/10"
            }`}
        >
          ➡
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
      />
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