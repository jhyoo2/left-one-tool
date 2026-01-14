"use client";

import type { CSSProperties, ChangeEvent } from "react";
import plist from "plist";
import styles from "./Common.module.css";

type LanOption = {
  value: string;
  name: string;
};

type SelectBoxProps = {
  options: LanOption[];
  style?: CSSProperties;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

type TextData = {
  data: Array<string | undefined>;
};

type TextBoxProps = {
  lanIdx: number;
  textData: TextData;
  setData: () => void;
};

type FileInputProps = {
  title?: string;
  imgURL?: string;
  imgString?: string;
  setFileData: (type: string, data: unknown) => void;
  width?: string | number;
  height?: string | number;
};

type AtlasFrame = {
  rotated?: boolean;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
};

type AtlasObject = {
  atlas?: Record<string, AtlasFrame>;
  imgString?: string;
  fileName?: string;
};

type SpineObject = {
  skeletonJson?: unknown;
  atlasText?: string;
  imgString?: string;
  fileName?: string;
};

type BulkObject = Record<string, string>;

type PlistFrame = {
  textureRotated?: boolean;
  textureRect?: string;
};

type PlistData = {
  frames?: Record<string, PlistFrame>;
};

export default function Common() {
  return null;
}

export const LanOptions: LanOption[] = [
  { value: "0", name: "한국어" },
  { value: "1", name: "영어" },
  { value: "2", name: "일본어" },
  { value: "3", name: "중문(간체)" },
  { value: "4", name: "중문(번체)" },
  { value: "5", name: "베트남어" },
  { value: "6", name: "인도네시아어" },
  { value: "7", name: "스페인어" },
  { value: "8", name: "브라질어" },
];

export const SelectBox = ({
  options,
  style,
  defaultValue,
  value,
  disabled,
  onChange,
}: SelectBoxProps) => {
  return (
    <select
      style={style}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export const TextBox = ({ lanIdx, textData, setData }: TextBoxProps) => {
  const targetList: Array<string | undefined> = [];
  for (let i = 0; i <= lanIdx; i += 1) {
    targetList.push(textData.data[i]);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        width: "100%",
      }}
    >
      {targetList.map((value, index) => (
        <input
          key={`textbox-${index}`}
          style={{
            background: "gray",
            alignSelf: "center",
            justifySelf: "center",
            textAlign: "center",
            border: "1px solid",
            width: "100%",
          }}
          value={value ?? ""}
          onChange={(event) => {
            textData.data[index] = event.target.value;
            setData();
          }}
        />
      ))}
    </div>
  );
};

export const readFileAsync = (file: File, filetype: 0 | 1) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("FileReader result is not a string."));
      }
    };
    reader.onerror = reject;
    if (filetype === 0) {
      reader.readAsDataURL(file);
    } else if (filetype === 1) {
      reader.readAsText(file);
    } else {
      reject(new Error("Unsupported filetype."));
    }
  });
};

export const readImgAsync = (fileResult: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = fileResult;
  });
};

const extractAtlasFrames = (plistText: string) => {
  const atlasData = plist.parse(plistText) as PlistData;
  const frames = atlasData?.frames;
  if (!frames) {
    return null;
  }

  const atlas: Record<string, AtlasFrame> = {};
  const keys = Object.keys(frames);
  for (const id of keys) {
    const pivot = id.replace(".png", "").replace(".jpg", "");
    const frameSource = frames[id];
    if (!frameSource?.textureRect) {
      continue;
    }

    const rect = frameSource.textureRect
      .replace(/}/g, "")
      .replace(/{/g, "")
      .split(",");

    atlas[pivot] = {
      rotated: frameSource.textureRotated,
      x: rect[0],
      y: rect[1],
      width: rect[2],
      height: rect[3],
    };
  }

  return atlas;
};

export const FileInput = ({
  title,
  imgURL,
  imgString,
  setFileData,
  width,
  height,
}: FileInputProps) => {
  const imgSrc = imgString || imgURL || "";

  const handleChange = async (fileInput: ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = fileInput.target.files;
    if (!uploadFiles || uploadFiles.length === 0) {
      return;
    }

    if (uploadFiles.length >= 10) {
      const bulkData: BulkObject = {};
      for (const file of Array.from(uploadFiles)) {
        const readerResult = await readFileAsync(file, 0);
        const mimeMatch = readerResult.match(
          /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
        );
        const mimeType = mimeMatch?.[1];
        if (mimeType === "image/png") {
          const imgResult = await readImgAsync(readerResult);
          bulkData[file.name] = imgResult.currentSrc;
        }
      }
      setFileData("10", bulkData);
      return;
    }

    if (uploadFiles.length >= 3) {
      const spineObject: SpineObject = {};
      for (const file of Array.from(uploadFiles)) {
        let readerResult = await readFileAsync(file, 0);
        if (file.name.includes("atlas") || file.name.includes("json")) {
          readerResult = await readFileAsync(file, 1);
          if (file.name.includes("json")) {
            spineObject.skeletonJson = JSON.parse(readerResult);
          } else if (file.name.includes("atlas")) {
            spineObject.atlasText = readerResult;
          }
        } else {
          const mimeMatch = readerResult.match(
            /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
          );
          const mimeType = mimeMatch?.[1];
          if (mimeType === "image/png") {
            const imgResult = await readImgAsync(readerResult);
            spineObject.imgString = imgResult.currentSrc;
            spineObject.fileName = file.name;
          }
        }
      }
      if (Object.keys(spineObject).length < 4) {
        return;
      }
      setFileData("01", spineObject);
      return;
    }

    if (uploadFiles.length >= 2) {
      const atlasObject: AtlasObject = {};
      for (const file of Array.from(uploadFiles)) {
        let readerResult = await readFileAsync(file, 0);
        if (file.name.includes("plist")) {
          readerResult = await readFileAsync(file, 1);
          const atlas = extractAtlasFrames(readerResult);
          if (atlas) {
            atlasObject.atlas = atlas;
          }
        } else {
          const mimeMatch = readerResult.match(
            /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
          );
          const mimeType = mimeMatch?.[1];
          if (mimeType === "image/png") {
            const imgResult = await readImgAsync(readerResult);
            atlasObject.imgString = imgResult.currentSrc;
            atlasObject.fileName = file.name;
          }
        }
      }
      if (Object.keys(atlasObject).length < 3) {
        return;
      }
      setFileData("03", atlasObject);
      return;
    }

    let preview: HTMLImageElement | null = null;
    for (const file of Array.from(uploadFiles)) {
      const readerResult = await readFileAsync(file, 0);
      const mimeMatch = readerResult.match(
        /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
      );
      const mimeType = mimeMatch?.[1];
      if (!mimeType || !mimeType.includes("image")) {
        continue;
      }
      preview = await readImgAsync(readerResult);
      break;
    }
    if (preview) {
      setFileData("02", preview.currentSrc);
    }
  };

  return (
    <div
      className={styles.iconTitleDiv}
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
      }}
    >
      {title ? (
        <div className={styles.collTitle} style={{ height: "100%" }}>
          {title}
        </div>
      ) : null}
      <div className={styles.costInput}>
        <img
          src={imgSrc}
          alt={title ?? "upload"}
          style={{
            width: "100%",
            overflow: "hidden",
            minHeight: "100px",
            maxHeight: "100px",
            objectFit: "contain",
          }}
        />
      </div>
      <label>
        <input
          type="file"
          multiple
          style={{
            overflow: "hidden",
            width: "0",
          }}
          onChange={handleChange}
        />
        Upload files
      </label>
    </div>
  );
};
