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
          "h-full p-2 [&_ol_li]:list-decimal [&_ul_li]:list-disc [&_ol]:my-2 [&_ol]:ps-7 [&_ul]:my-2 [&_ul]:ps-6 mx-auto rounded-lg bg-white shadow-md border border-gray-300 scroll-mt-4",
      },
    },
    onFocus(e) {
      if (!e?.event?.target) {
        return;
      }
      if (e.event.target instanceof HTMLElement) {
        e.event.target.scrollIntoView({ behavior: "instant", block: "start" });
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
      <EditorContent editor={editor} className="grow" />
    </div>
  );
}
