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
      <div className="flex items-center justify-center h-screen">
        <CardComponent heading="Welcome!" className="prose shadow-lg">
          <p>Start by going to the main menu.</p>
          <ul>
            <li>Click "New" to start a project by selecting a PDF.</li>
            <li>Click "Open" to open an existing project file.</li>
          </ul>
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
