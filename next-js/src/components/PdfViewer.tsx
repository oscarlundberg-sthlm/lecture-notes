"use client";
import { useDataContext } from "@/contexts/Data";
import { Alert } from "antd";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import NotesEditor from "./NotesEditor";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfProps {
  pdfWidth?: number;
}

export default function PdfViewer({ pdfWidth }: PdfProps) {
  const {
    pdf,
    notes,
    setNotes,
    projektKey,
    setCurrentFilepath,
    currentFilepath,
    setLastSavedAtTimestamp,
  } = useDataContext();
  const { base64 } = pdf || {};
  const [numPages, setNumPages] = useState<number | null>(null);

  // Reset numPages when a new PDF is loaded
  useEffect(() => {
    setNumPages(null);
  }, [base64]);

  if (!base64) {
    return (
      <Alert
        title="Warning"
        description="No PDF provided."
        type="warning"
        showIcon
        closable
      />
    );
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number | null }) {
    setNumPages(numPages);
  }

  async function handleNoteChange(pageNumber: number, content: string) {
    setNotes((prev) => {
      const newNotes = { ...prev, [pageNumber]: content };

      // is this a new project?
      if (!currentFilepath) return newNotes;

      // autosave
      window.electronApi
        .saveToDisk({
          pdf,
          notes: newNotes, // använd nya värdet
        })
        .then((currentFilepath: string | undefined) => {
          if (currentFilepath) {
            setCurrentFilepath(currentFilepath);
            setLastSavedAtTimestamp(Date.now());
          }
        });

      return newNotes;
    });
  }

  return (
    <Document
      key={projektKey}
      file={base64}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <div key={`page_${index + 1}`} className="grid grid-cols-3 gap-4 mb-4">
          <Page
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="border border-gray-300 shadow-md rounded-lg col-span-2 overflow-hidden"
            width={pdfWidth}
          />
          <NotesEditor
            key={projektKey + "-" + (index + 1)}
            value={notes[index + 1] || ""}
            onSave={(html) => handleNoteChange(index + 1, html)}
            className="flex flex-col"
          />
        </div>
      ))}
    </Document>
  );
}
