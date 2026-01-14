"use client";

import { PropsWithChildren } from "react";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <button className={styles.leftButton} type="button">
          Menu
        </button>
        <div className={styles.title}>LEFT-ONE</div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
