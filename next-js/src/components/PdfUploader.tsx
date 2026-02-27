// TODO: this component is currently unused. Uploading is happening via Electron.
import { useDataContext } from "@/contexts/Data";

interface Props {}

function PdfUploader({}: Props) {
  const { setPdf, setNotes, setCurrentFilepath, setLastSavedAtTimestamp } =
    useDataContext();
  const data = useDataContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // reset DataContext
    setPdf(null);
    setNotes({});
    setCurrentFilepath(undefined);
    setLastSavedAtTimestamp(undefined);

    // make pdf into base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      setPdf({ filename: file.name, base64 });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };

    console.log(data);
  };

  return (
    <label className="block cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      Begin with a PDF
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}

export default PdfUploader;
