import { MY_G } from "../constants/math";
import { MaterialPoint, RungiMaterialPoint } from "../types/metric";

export const powSumSqrt = (a: number, b: number) => {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

export const lenPts = (
  { point: { x: x1, y: y1 } }: Omit<MaterialPoint, "weight">,
  { point: { x: x2, y: y2 } }: Omit<MaterialPoint, "weight">
) => {
  return powSumSqrt(y2 - y1, x2 - x1);
};

export const model1: RungiMaterialPoint = {
  point: {
    x: (x, { velocity, point: { y: py } }, mPts, idx) => {
      if (!velocity) {
        throw Error("model1 dxdt nullable velocity");
      }

      const ptTarget = idx === mPts.length - 1 ? mPts[0] : mPts[idx + 1];

      return (
        (powSumSqrt(velocity.x, velocity.y) * (ptTarget.point.x - x)) /
        lenPts({ point: { x, y: py } }, ptTarget)
      );
    },

    y: (y, { velocity, point: { x: px } }, mPts, idx) => {
      if (!velocity) {
        throw Error("model1 dxdt nullable velocity");
      }

      const ptTarget = idx === mPts.length - 1 ? mPts[0] : mPts[idx + 1];

      return (
        (powSumSqrt(velocity.x, velocity.y) * (ptTarget.point.y - y)) /
        lenPts({ point: { x: px, y } }, ptTarget)
      );
    },
  },
  velocity: {},
};

export const model2: RungiMaterialPoint = {
  point: {
    x: (_, { velocity }) => {
      return velocity?.x || 0;
    },

    y: (_, { velocity }) => {
      return velocity?.y || 0;
    },
  },
  velocity: {
    x: (_, mPt, mPts, idx) => {
      return mPts.reduce((sum, curMPt, curIdx) => {
        if (curIdx === idx || !curMPt.weight || !mPt.weight) return sum;
        return (
          sum +
          (MY_G * curMPt.weight * mPt.weight * (curMPt.point.x - mPt.point.x)) /
            Math.pow(lenPts(mPt, curMPt), 3)
        );
      }, 0);
    },

    y: (_, mPt, mPts, idx) => {
      return mPts.reduce((sum, curMPt, curIdx) => {
        if (curIdx === idx || !curMPt.weight || !mPt.weight) return sum;
        const t =
          sum +
          (MY_G * curMPt.weight * mPt.weight * (curMPt.point.y - mPt.point.y)) /
            Math.pow(lenPts(mPt, curMPt), 3);
        return t;
      }, 0);
    },
  },
};

function rungiKutta(fun: (y: number) => number, y: number, h: number): number {
  if (h) {
    const f1 = fun(y);
    const f2 = fun(y + (h / 2) * f1);
    const f3 = fun(y + (h / 2) * f2);
    const f4 = fun(y + h * f3);
    return y + (h / 6) * (f1 + 2 * f2 + 2 * f3 + f4);
  }
  return y + fun(y);
}

export const model1NextFrame = (
  model: RungiMaterialPoint,
  arr: MaterialPoint[],
  h: number
): MaterialPoint[] => {
  return arr.map((mPt, idx) => ({
    ...mPt,
    point: {
      x: model.point.x
        ? //@ts-ignore
          rungiKutta((x) => model.point.x(x, mPt, arr, idx), mPt.point.x, h)
        : mPt.point.x,

      y: model.point.y
        ? //@ts-ignore
          rungiKutta((y) => model.point.y(y, mPt, arr, idx), mPt.point.y, h)
        : mPt.point.y,
    },
    velocity: mPt.velocity && {
      x: model.velocity.x
        ? rungiKutta(
            //@ts-ignore
            (x) => model.velocity.x(x, mPt, arr, idx),
            mPt.velocity.x,
            h
          )
        : mPt.velocity.x,

      y: model.velocity.y
        ? rungiKutta(
            //@ts-ignore
            (y) => model.velocity.y(y, mPt, arr, idx),
            mPt.velocity.y,
            h
          )
        : mPt.velocity.y,
    },
  }));
};
