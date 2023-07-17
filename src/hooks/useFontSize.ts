import { useEffect, useReducer, useState } from "react";

export interface UseFontSizeProps {
  storageKey?: string;
  initialSize?: number;
  variableName?: string;
}

const applyPropToDocument = (variableName: string, newFontSize: number) => {
  document.documentElement.style.setProperty(variableName, `${newFontSize}px`);
};

export function useFontSize({
  initialSize = 16,
  variableName = "--font-size",
}: UseFontSizeProps = {}) {
  const storageKey = "f_s";
  const storage = localStorage.getItem(storageKey);
  const [storedFontSize, storeFontSize] = useState(
    storage ? Number(storage) : initialSize
  );

  useEffect(() => {
    localStorage.setItem(storageKey, storedFontSize.toString());
  }, [storedFontSize]);

  function init(initialValue: number) {
    if (typeof window === "undefined") return initialValue;
    if (storedFontSize) applyPropToDocument(variableName, storedFontSize);
    return Number(storedFontSize);
  }

  function reducer(_state: number, newFontSize: number) {
    applyPropToDocument(variableName, newFontSize);
    storeFontSize(newFontSize);
    return newFontSize;
  }

  return useReducer(reducer, initialSize, init);
}

export default useFontSize;
