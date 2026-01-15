"use client";

import { useEffect, useState } from "react";
import NakamaManager from "@/lib/nakama/NakamaManager";
import { usePageContext } from "@/components/PageContext";
import { pageEntries } from "@/pages/pageRegistry";
import styles from "@/common/Common.module.css";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { pageKind } = usePageContext();

  useEffect(() => {
    const nakamaManager = NakamaManager.getInstance() as any;
    if (!nakamaManager.session) {
      nakamaManager.initNakamaManager().then(() => {
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, []);

  const CurrentPage = pageEntries[pageKind]?.component ?? pageEntries[0].component;

  return (
    <div className={styles.page}>
      {!loaded ? (
        <div className={styles.loading}>data is loading...</div>
      ) : (
        <CurrentPage />
      )}
    </div>
  );
}
