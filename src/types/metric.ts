export type Point = {
  x: number;
  y: number;
};
export type Points = Point[];
export type History = Points[];
export type Vector = Point;
export interface MaterialPoint {
  point: Point;
  weight: number;
  velocity?: Vector;
  color?: string;
}

export type rungiFunc = (
  y: number,
  mPt: MaterialPoint,
  arr: MaterialPoint[],
  idx: number
) => number;

export interface RungiMaterialPoint {
  point: {
    x?: rungiFunc;
    y?: rungiFunc;
  };
  weight?: rungiFunc;
  velocity: {
    x?: rungiFunc;
    y?: rungiFunc;
  };
}

export interface PerfectModel {
  n: number;
  a: number;
  v: number;
  mPts?: number;
  mCenterPt?: number;
}
