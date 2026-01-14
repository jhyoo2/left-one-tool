"use client";

import { useEffect, useState } from "react";
import styles from "./GameDataLayer.module.css";

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
    <div className={styles.layer}>
      <div className={styles.tabs}>
        {sectionNames.map((name, index) => (
          <button
            key={name}
            className={
              sectionKind === index
                ? `${styles.tabButton} ${styles.tabButtonActive}`
                : styles.tabButton
            }
            type="button"
            onClick={() => handleSelect(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>{currentLabel}</h3>
        <p className={styles.panelText}>
          alcatmist-tool의 GameDataLayer 섹션 컴포넌트를 여기에 연결하면 됩니다.
        </p>
      </div>
    </div>
  );
}
