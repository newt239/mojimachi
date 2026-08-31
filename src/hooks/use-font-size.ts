import { useEffect, useState } from "react";

const STORAGE_KEY = "f_s";

export type UseFontSizeProps = {
  initialSize?: number;
  variableName?: string;
};

export const useFontSize = ({
  initialSize = 16,
  variableName = "--font-size",
}: UseFontSizeProps = {}) => {
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? initialSize : Number(stored);
  });

  useEffect(() => {
    document.documentElement.style.setProperty(variableName, `${fontSize}px`);
    localStorage.setItem(STORAGE_KEY, String(fontSize));
  }, [fontSize, variableName]);

  return { fontSize, setFontSize };
};
