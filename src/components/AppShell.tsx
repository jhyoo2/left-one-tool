"use client";

import { PropsWithChildren } from "react";
import styles from "@/common/Common.module.css";
import { usePageContext } from "./PageContext";

export default function AppShell({ children }: PropsWithChildren) {
  const { pageKind, pageNames, setPageKind } = usePageContext();

  return (
    <div className={styles.appShell}>
      <header className={styles.appShellHeader}>
        {/* <button className={styles.leftButton} type="button">
          Menu
        </button> */}
        <div className={styles.appShellTitleBlock}>
          <div className={styles.appShellTabs}>
            {pageNames.map((name, index) => (
              <button
                key={name}
                className={
                  pageKind === index
                    ? `${styles.appShellTabButton} ${styles.appShellTabButtonActive}`
                    : styles.appShellTabButton
                }
                type="button"
                onClick={() => setPageKind(index)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.appShellRightSlot} />
      </header>
      <main className={styles.appShellMain}>{children}</main>
    </div>
  );
}
