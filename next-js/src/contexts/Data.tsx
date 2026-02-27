// create a context that can handle an uploaded pdf file and make it available to all components in the app
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface DataContextType {
  pdf: {
    filename?: string;
    base64?: string;
  } | null;
  setPdf: Dispatch<SetStateAction<DataContextType["pdf"]>>;
  notes: {
    [pageNumber: number]: string;
  };
  setNotes: Dispatch<SetStateAction<DataContextType["notes"]>>;
  projektKey: string;
  setProjektKey: Dispatch<SetStateAction<string>>;
  currentFilepath?: string;
  setCurrentFilepath: Dispatch<SetStateAction<string | undefined>>;
  lastSavedAtTimestamp?: number;
  setLastSavedAtTimestamp: Dispatch<SetStateAction<number | undefined>>;
}

export type PureDataNoFunctions = Pick<DataContextType, "pdf" | "notes">;

export const DataContext = createContext<DataContextType>({
  pdf: null,
  setPdf: () => {},
  notes: {},
  setNotes: () => {},
  projektKey: "0",
  setProjektKey: () => {},
  currentFilepath: undefined,
  setCurrentFilepath: () => {},
  lastSavedAtTimestamp: undefined,
  setLastSavedAtTimestamp: () => {},
});

export const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pdf, setPdf] = useState<DataContextType["pdf"]>(null);
  const [notes, setNotes] = useState<DataContextType["notes"]>({});
  const [projektKey, setProjektKey] = useState<string>("0");
  const [currentFilepath, setCurrentFilepath] = useState<string | undefined>(
    undefined,
  );
  const [lastSavedAtTimestamp, setLastSavedAtTimestamp] = useState<
    number | undefined
  >(undefined);

  return (
    <DataContext.Provider
      value={{
        pdf,
        setPdf,
        notes,
        setNotes,
        projektKey,
        setProjektKey,
        currentFilepath,
        setCurrentFilepath,
        lastSavedAtTimestamp,
        setLastSavedAtTimestamp,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useDataContext() {
  return useContext(DataContext);
}
