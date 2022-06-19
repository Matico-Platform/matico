import type { GridLayout } from "./GridLayout";
import type { LinearLayout } from "./LinearLayout";
import type { TabLayout } from "./TabLayout";

export type Layout = { type: "free" } | { type: "linear" } & LinearLayout | { type: "grid" } & GridLayout | { type: "tabs" } & TabLayout;