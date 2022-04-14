export type Point = {
  x: number;
  y: number;
};
export type Points = Point[];
export type History = Points[];
export type Vector = Point;
export interface MaterialPoint {
  point: Point;
  weight?: number;
  velocity?: Vector;
}

export interface PerfectModel {
  n: number;
  a: number;
  v: number;
}
