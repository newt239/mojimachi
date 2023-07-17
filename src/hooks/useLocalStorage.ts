import { useEffect, useState } from "react";

type ReturnType = [
  string | number,
  React.Dispatch<React.SetStateAction<string | number>>
];

const useLocalStorage = (
  storageKey: string,
  fallbackState: string | number
): ReturnType => {
  const storage = localStorage.getItem(storageKey);
  const [value, setValue] = useState(storage ? storage : fallbackState);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

export default useLocalStorage;
