"use client";

import { useEffect, useState } from "react";

export const useSectionState = (storageKey: string, initialValue = 0) => {
  const [sectionKind, setSectionKind] = useState(initialValue);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const next = Number(JSON.parse(saved));
      if (!Number.isNaN(next)) {
        setSectionKind(next);
      }
    }
  }, [storageKey]);

  const handleSelect = (index: number) => {
    setSectionKind(index);
    window.localStorage.setItem(storageKey, JSON.stringify(index));
  };

  return { sectionKind, handleSelect };
};
