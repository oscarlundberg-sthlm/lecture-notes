"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

type Props = {
  value: string;
  onSave: (html: string) => void;
  className?: string;
};

export default function NotesEditor({ value, onSave, className }: Props) {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "h-full p-2 [&_ol_li]:list-decimal [&_ul_li]:list-disc [&_ol]:my-2 [&_ol]:ps-7 [&_ul]:my-2 [&_ul]:ps-6 mx-auto rounded-lg shadow-md border border-gray-300",
      },
    },
    onFocus(e) {
      if (!e?.event?.target) {
        return;
      }
      if (e.event.target instanceof HTMLElement) {
        e.event.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    onUpdate({ editor }) {
      // debounce autosave
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(() => {
        onSave(editor.getHTML());
      }, 500);
    },
  });

  if (!editor) return null;

  return (
    <div className={className}>
      {/* Toolbar */}
      {/* <div className="flex gap-2 mb-2 border-b pb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded"
        >
          Undo
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded"
        >
          Redo
        </button>
      </div> */}

      {/* Editor */}
      <EditorContent editor={editor} className="grow" />
    </div>
  );
}
