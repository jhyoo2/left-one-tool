"use client";

import { useEffect, useState } from "react";
import styles from "@/common/Common.module.css";

const sectionNames = [
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
  "Section 5",
  "Section 6",
  "Section 7",
  "Section 8",
  "Section 9",
];

export default function GameDataLayer() {
  const [sectionKind, setSectionKind] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("gameSectionKind");
    if (saved) {
      const next = Number(JSON.parse(saved));
      if (!Number.isNaN(next)) {
        setSectionKind(next);
      }
    }
  }, []);

  const handleSelect = (index: number) => {
    setSectionKind(index);
    window.localStorage.setItem("gameSectionKind", JSON.stringify(index));
  };

  const currentLabel = sectionNames[sectionKind] ?? "Section";

  return (
    <div className={styles.panel}>
      <div className={styles.gameDataLayer}>
        <div className={styles.gameDataTabs}>
          {sectionNames.map((name, index) => (
            <button
              key={name}
              className={
                sectionKind === index
                  ? `${styles.gameDataTabButton} ${styles.gameDataTabButtonActive}`
                  : styles.gameDataTabButton
              }
              type="button"
              onClick={() => handleSelect(index)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.gameDataPanel}>
          <h3 className={styles.gameDataPanelTitle}>{currentLabel}</h3>
          <p className={styles.gameDataPanelText}>
            alcatmist-tool의 GameDataLayer 섹션 컴포넌트를 여기에 연결하면
            됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
