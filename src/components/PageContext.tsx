"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { pageNames } from "@/pages/pageRegistry";

type PageContextValue = {
  pageKind: number;
  setPageKind: (next: number) => void;
  pageNames: string[];
};

const PageContext = createContext<PageContextValue | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [pageKind, setPageKindState] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("pageKind");
    if (saved) {
      const next = Number(JSON.parse(saved));
      if (!Number.isNaN(next)) {
        setPageKindState(next);
      }
    }
  }, []);

  const setPageKind = (next: number) => {
    setPageKindState(next);
    window.localStorage.setItem("pageKind", JSON.stringify(next));
  };

  const value = useMemo(
    () => ({ pageKind, setPageKind, pageNames }),
    [pageKind]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within PageProvider.");
  }
  return context;
}
