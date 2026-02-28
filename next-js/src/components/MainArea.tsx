"use client";

import { useDataContext } from "@/contexts/Data";
import CardComponent from "./Card";
import PdfViewer from "./PdfViewer";
import ResponsiveBox from "./ResponsiveBox";

interface Props {}

const MainArea = (props: Props) => {
  const { pdf } = useDataContext();
  const { base64 } = pdf || {};

  if (!base64) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-400">
        <CardComponent
          heading={
            <div className="flex items-center gap-4 mb-3.5 mt-4.5">
              <div className="text-3xl">✍️</div>
              <div className="grow">
                <div>Lecture Notes</div>
                <div className="text-sm font-normal text-gray-600">
                  PDF to the left, notes to the right.
                </div>
              </div>
            </div>
          }
          className="prose shadow-lg"
        >
          <p className="mt-0">Start guide:</p>
          <ol>
            <li>Menu (up there ↖︎)</li>
            <li>New</li>
            <li>Select a PDF</li>
          </ol>
        </CardComponent>
      </div>
    );
  }
  return (
    <div className="p-4">
      <ResponsiveBox>
        {(width) => <PdfViewer pdfWidth={(width / 3) * 2 - 16 / 2} />}
      </ResponsiveBox>
    </div>
  );
};

export default MainArea;
