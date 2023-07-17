import { useReducer } from "react";

import useLocalStorage from "./useLocalStorage";

export interface UseFontSizeProps {
  storageKey?: string;
  initialSize?: number;
  variableName?: string;
}

const applyPropToDocument = (variableName: string, storedFontSize: string) => {
  document.documentElement.style.setProperty(variableName, storedFontSize);
};

const getDocumentProp = (variableName: string) => {
  return document.documentElement.style.getPropertyValue(variableName);
};

export function useFontSize({
  storageKey = "f_s",
  initialSize = 16,
  variableName = "--font-size",
}: UseFontSizeProps = {}) {
  const [storedFontSize, storeFontSize] = useLocalStorage(
    storageKey,
    initialSize.toString() // convert initialSize to string
  );

  function init(initialValue: number) {
    if (typeof window === "undefined") return initialValue;
    if (storedFontSize)
      applyPropToDocument(variableName, storedFontSize.toString());
    return Number(storedFontSize);
  }

  function reducer(_state: number, newFontSize: number) {
    // change _state to number
    applyPropToDocument(variableName, `${newFontSize}px`);
    storeFontSize(newFontSize.toString()); // convert newFontSize to string
    return newFontSize;
  }

  return useReducer(reducer, initialSize, init);
}

export default useFontSize;
