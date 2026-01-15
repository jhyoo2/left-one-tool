"use client";

import styles from "@/common/Common.module.css";
import { useSectionState } from "@/common/useSectionState";
import { sections } from "./sections";

export default function StageDataPanel() {
  const { sectionKind, handleSelect } = useSectionState("stageSectionKind");
  const currentSection = sections[sectionKind] ?? sections[0];
  const CurrentSectionView = currentSection?.render;

  return (
    <div className={styles.pageLayout}>
      <aside className={styles.pageNav}>
        {sections.map((section, index) => (
          <button
            key={section.label}
            className={
              sectionKind === index
                ? `${styles.pageNavButton} ${styles.pageNavButtonActive}`
                : styles.pageNavButton
            }
            type="button"
            onClick={() => handleSelect(index)}
          >
            {section.label}
          </button>
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
