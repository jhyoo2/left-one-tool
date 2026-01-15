"use client";

import { useState } from "react";
import NakamaManager from "@/lib/nakama/NakamaManager";
import styles from "@/common/Common.module.css";

export default function DataSetter() {
  const [dbKey, setDbKey] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!dbKey.trim()) {
      alert("db key를 입력하세요.");
      return;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch (error) {
      alert("JSON 형식이 올바르지 않습니다.");
      return;
    }

    setSending(true);
    try {
      const nakamaManager = NakamaManager.getInstance() as any;
      const response = await nakamaManager.sendData(
        "common_data",
        dbKey.trim(),
        parsedJson
      );

      const success =
        response &&
        (response.success === true ||
          response.status === "200" ||
          response.status === 200);

      if (success) {
        alert("저장 성공");
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      alert("저장 실패");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.panel}>
      <h2>공통 데이터 저장</h2>
      <div className={styles.form}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>db key</span>
          <input
            className={styles.textInput}
            type="text"
            value={dbKey}
            onChange={(event) => setDbKey(event.target.value)}
            placeholder="예: common_config"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>json</span>
          <textarea
            className={styles.textArea}
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder='{"key":"value"}'
            rows={12}
          />
        </label>
        <div className={styles.actionRow}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "전송 중..." : "서버에 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
