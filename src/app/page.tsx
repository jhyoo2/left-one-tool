"use client";

import { useEffect, useState } from "react";
import NakamaManager from "@/lib/nakama/NakamaManager";
import { usePageContext } from "@/components/PageContext";
import GameDataLayer from "@/components/GameDataLayer";
import styles from "./page.module.css";

function GameDataPanel() {
  return (
    <div className={styles.panel}>
      <GameDataLayer />
    </div>
  );
}

function UnitDataPanel() {
  return (
    <div className={styles.panel}>
      <h2>유닛 데이터 관리</h2>
      <p>유닛 데이터 관련 컴포넌트를 여기에 연결하세요.</p>
    </div>
  );
}

function StageDataPanel() {
  return (
    <div className={styles.panel}>
      <h2>스테이지 데이터 관리</h2>
      <p>스테이지 데이터 관련 컴포넌트를 여기에 연결하세요.</p>
    </div>
  );
}

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
  let panel = <GameDataPanel />;
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
