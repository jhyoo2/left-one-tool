"use client";

import GameDataLayer from "@/pages/GameDataLayer";
import UnitDataPanel from "@/pages/UnitDataPanel";
import StageDataPanel from "@/pages/StageDataPanel";

export const pageEntries = [
  {
    label: "1. 게임 데이터 관리",
    component: GameDataLayer,
  },
  {
    label: "2. 유닛 데이터 관리",
    component: UnitDataPanel,
  },
  {
    label: "3. 스테이지 데이터 관리",
    component: StageDataPanel,
  },
];

export const pageNames = pageEntries.map((entry) => entry.label);
