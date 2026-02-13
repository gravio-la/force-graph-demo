import { createContext, useContext, useState, ReactNode } from "react";

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  setFocusMode: (value: boolean) => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, setFocusMode: setIsFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
}
