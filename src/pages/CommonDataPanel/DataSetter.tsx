"use client";

import { useState, type DragEvent } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import NakamaManager from "@/lib/nakama/NakamaManager";
import styles from "@/common/Common.module.css";
import { readFileAsync } from "@/common/Common";

export default function DataSetter() {
  const [dbKey, setDbKey] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [merged, setMerged] = useState(false);
  const [sending, setSending] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

      const success = await nakamaManager.saveGameData(
        dbKey.trim(),
        parsedJson,
        merged
      );

      console.log("check response", success);

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

  const handleJsonDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }

    const [file] = Array.from(files);
    try {
      const text = await readFileAsync(file, 1);
      setJsonText(text);
    } catch (error) {
      alert("JSON 파일을 읽지 못했습니다.");
    }
  };

  return (
    <div className={styles.panel}>
      <h2>공통 데이터 저장</h2>
      <div className={styles.form}>
        <FormControlLabel
          control={
            <Checkbox
              checked={merged}
              onChange={(event) => setMerged(event.target.checked)}
            />
          }
          label="merged"
        />
        <TextField
          label="db key"
          value={dbKey}
          onChange={(event) => setDbKey(event.target.value)}
          placeholder="예: common_config"
          size="small"
          fullWidth
        />
        <div
          className={`${styles.dropTarget} ${
            isDragOver ? styles.dropActive : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleJsonDrop}
        >
          <TextField
            label="json"
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder='{"key":"value"}'
            multiline
            minRows={12}
            fullWidth
          />
          <p className={styles.dropHint}>JSON 파일을 드래그 앤 드랍하세요.</p>
        </div>
        <div className={styles.actionRow}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "전송 중..." : "서버에 저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}
