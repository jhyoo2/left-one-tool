"use client";

import { PropsWithChildren } from "react";
import styles from "./AppShell.module.css";
import { usePageContext } from "./PageContext";

export default function AppShell({ children }: PropsWithChildren) {
  const { pageKind, pageNames, setPageKind } = usePageContext();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        {/* <button className={styles.leftButton} type="button">
          Menu
        </button> */}
        <div className={styles.titleBlock}>
          <div className={styles.tabs}>
            {pageNames.map((name, index) => (
              <button
                key={name}
                className={
                  pageKind === index
                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                    : styles.tabButton
                }
                type="button"
                onClick={() => setPageKind(index)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.rightSlot} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
