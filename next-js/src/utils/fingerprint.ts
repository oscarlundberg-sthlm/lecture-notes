import { PureDataNoFunctions } from "@/contexts/Data";

function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convert to 32bit int
  }
  return hash.toString();
}

// Som en "key" för att avgöra re-render
export function getProjectFingerprint({ pdf, notes }: PureDataNoFunctions) {
  if (!pdf?.base64) return "0-0"; // PDF utan innehåll
  const pdfHash = pdf ? simpleHash(pdf.base64.slice(0, 1000)) : "0"; // bara första 1000 tecken
  const notesHash = simpleHash(JSON.stringify(notes));
  return pdfHash + "-" + notesHash;
}
