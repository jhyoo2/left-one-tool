"use client";

import Button from "@mui/material/Button";
import styles from "@/common/Common.module.css";
import { useSectionState } from "@/common/useSectionState";
import { sections } from "./sections";

export default function GameDataLayer() {
  const { sectionKind, handleSelect } = useSectionState("gameSectionKind");

  const currentSection = sections[sectionKind] ?? sections[0];
  const CurrentSectionView = currentSection?.render;

  return (
    <div className={styles.pageLayout}>
      <aside className={styles.pageNav}>
        {sections.map((section, index) => (
          <Button
            key={section.label}
            variant={sectionKind === index ? "contained" : "outlined"}
            size="small"
            onClick={() => handleSelect(index)}
            sx={{
              width: "75%",
              alignSelf: "center",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {section.label}
          </Button>
        ))}
      </aside>
      <section className={styles.pageContent}>
        {CurrentSectionView ? (
          <CurrentSectionView />
        ) : (
          <div className={styles.panel}>
            <h2>{currentSection.label}</h2>
            <p>{currentSection.description}</p>
          </div>
        )}
      </section>
    </div>
  );
}
