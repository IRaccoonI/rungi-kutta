import { MIN_OPACITY } from "../constants/holst";

export function randomDarkColor(): string {
  const darkColor = () => (Math.floor(Math.random() * 162) + 56).toString(16);
  return "#" + darkColor() + darkColor() + darkColor();
}

export function opacityByIdx(idx: number, maxIdx: number): number {
  return MIN_OPACITY + ((1 - MIN_OPACITY) * idx) / maxIdx;
}
