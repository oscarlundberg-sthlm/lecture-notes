import { PureDataNoFunctions, useDataContext } from "@/contexts/Data";
import { getProjectFingerprint } from "@/utils/fingerprint";
import { useEffect, useRef } from "react";

function FileHandler() {
  const {
    pdf,
    setPdf,
    notes,
    setNotes,
    setProjektKey,
    setCurrentFilepath,
    setLastSavedAtTimestamp,
  } = useDataContext();

  const pdfRef = useRef(pdf);
  const notesRef = useRef(notes);

  useEffect(() => {
    pdfRef.current = pdf;
    notesRef.current = notes;
  }, [pdf, notes]);

  useEffect(() => {
    window.electronApi.onNewProject(
      (data: { pdf: { base64: string; filename: string } }) => {
        console.log(data);
        setPdf(data.pdf);
        setNotes({});
        setProjektKey("0");
        setCurrentFilepath(undefined);
        setLastSavedAtTimestamp(undefined);
      },
    );

    window.electronApi.onProjectOpened(
      (data: PureDataNoFunctions & { currentFilepath?: string }) => {
        setNotes(data.notes);
        setPdf(data.pdf);

        if (data.currentFilepath) {
          setCurrentFilepath(data.currentFilepath);
        }

        const fingerprint = getProjectFingerprint(data);
        setProjektKey(fingerprint);

        setLastSavedAtTimestamp(undefined);
      },
    );

    window.electronApi.onMenuSave(async () => {
      const currentFilepath = await window.electronApi.saveToDisk({
        pdf: pdfRef.current,
        notes: notesRef.current,
      });
      if (currentFilepath) {
        setCurrentFilepath(currentFilepath);
        setLastSavedAtTimestamp(Date.now());
      }
    });

    window.electronApi.onMenuSaveAs(async () => {
      const currentFilepath = await window.electronApi.saveToDisk(
        {
          pdf: pdfRef.current,
          notes: notesRef.current,
        },
        true,
      );
      if (currentFilepath) {
        setCurrentFilepath(currentFilepath);
        setLastSavedAtTimestamp(Date.now());
      }
    });

    return () => {
      window.electronApi.removeProjectOpenedListener();
      window.electronApi.removeMenuSaveListener();
      window.electronApi.removeMenuSaveAsListener();
    };
  }, []);

  return <></>;
}

export default FileHandler;
