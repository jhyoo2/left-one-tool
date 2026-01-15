"use client";

import { PropsWithChildren } from "react";
import Button from "@mui/material/Button";
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
              <Button
                key={name}
                variant={pageKind === index ? "contained" : "outlined"}
                size="small"
                onClick={() => setPageKind(index)}
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
        <div className={styles.appShellRightSlot} />
      </header>
      <main className={styles.appShellMain}>{children}</main>
    </div>
  );
}
