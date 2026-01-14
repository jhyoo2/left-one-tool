"use client";

import { useEffect, useState } from "react";
import NakamaManager from "@/lib/nakama/NakamaManager";
import styles from "./page.module.css";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [loadedNum, setLoadedNum] = useState(0);

  useEffect(() => {
    const nakamaManager = NakamaManager.getInstance() as any;
    if (!nakamaManager.session) {
      nakamaManager.loadCB = (num: number) => {
        setLoadedNum((prev) => Math.max(prev, num));
      };
      nakamaManager.initNakamaManager().then(() => {
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={styles.page}>
      {!loaded ? (
        <div className={styles.loading}>
          data is loading... {loadedNum} / 12
        </div>
      ) : (
        <div className={styles.center}>
          <h1>Ready</h1>
          <p>Nakama 연결이 완료되면 여기에 페이지 컨텐츠가 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}
