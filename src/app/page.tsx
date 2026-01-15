"use client";

import { useEffect, useState } from "react";
import NakamaManager from "@/lib/nakama/NakamaManager";
import { usePageContext } from "@/components/PageContext";
import GameDataLayer from "@/pages/GameDataLayer";
import UnitDataPanel from "@/pages/UnitDataPanel";
import StageDataPanel from "@/pages/StageDataPanel";
import styles from "@/common/Common.module.css";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { pageKind, pageNames } = usePageContext();

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

  const currentLabel = pageNames[pageKind] ?? "페이지";
  let panel = <GameDataLayer />;
  if (pageKind === 1) {
    panel = <UnitDataPanel />;
  } else if (pageKind === 2) {
    panel = <StageDataPanel />;
  }

  return (
    <div className={styles.page}>
      {!loaded ? (
        <div className={styles.loading}>data is loading...</div>
      ) : (
        <>{panel}</>
      )}
    </div>
  );
}
