"use client";

import GameDataLayer from "@/pages/GameDataLayer";
import UnitDataPanel from "@/pages/UnitDataPanel";
import StageDataPanel from "@/pages/StageDataPanel";
import CommonDataPanel from "@/pages/CommonDataPanel";

export const pageEntries = [
  {
    label: "게임 데이터 관리",
    component: GameDataLayer,
  },
  {
    label: "유닛 데이터 관리",
    component: UnitDataPanel,
  },
  {
    label: "스테이지 데이터 관리",
    component: StageDataPanel,
  },
  {
    label: "공통 데이터 관리",
    component: CommonDataPanel,
  },
];

export const pageNames = pageEntries.map((entry) => entry.label);
