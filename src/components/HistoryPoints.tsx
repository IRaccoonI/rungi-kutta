import React from "react";
import styled from "styled-components";
import { CIRCLE_RADIUS } from "../constants/holst";
import { opacityByIdx } from "../lib/color";
import { MaterialPoint } from "../types/metric";
import { Dimensions } from "../types/sizing";

interface HolstProps {
  materialPointsHistory: MaterialPoint[][];
  maxPointHistoryDeps: number;
}

const Holst: React.FC<HolstProps> = ({
  materialPointsHistory,
  maxPointHistoryDeps,
}) => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const onResize = React.useCallback(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  React.useLayoutEffect(onResize, [onResize]);
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewBox = React.useMemo(() => {
    return `0 0 ${dimensions.width} ${dimensions.height}`;
  }, [dimensions.height, dimensions.width]);

  return (
    <StyledHolst className="w-100 h-100" ref={targetRef}>
      <svg className="w-100 h-100" viewBox={viewBox}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {materialPointsHistory.map((mPts, idxMain, mPtsArr) => {
          if (mPtsArr.length - maxPointHistoryDeps > idxMain) return <></>;

          return (
            <>
              {mPts.map(
                ({ point: { x: px, y: py }, color = "#000", weight }, idx) => {
                  const prevPt: MaterialPoint | null = idxMain
                    ? mPtsArr[idxMain - 1][idx]
                    : null;

                  return (
                    <>
                      {prevPt ? (
                        <line
                          x1={prevPt.point.x}
                          y1={prevPt.point.y}
                          x2={px}
                          y2={py}
                          stroke={color}
                          opacity={opacityByIdx(idxMain + 1, mPtsArr.length)}
                        />
                      ) : null}
                      <circle
                        cx={px}
                        cy={py}
                        r={CIRCLE_RADIUS * Math.sqrt(Math.abs(weight) || 1 / 3)}
                        fill={weight < 0 ? "white" : color}
                        opacity={opacityByIdx(idxMain + 1, mPtsArr.length)}
                        stroke="black"
                        stroke-width={weight < 0 ? "1" : "0"}
                      />
                    </>
                  );
                }
              )}
            </>
          );
        })}
      </svg>
    </StyledHolst>
  );
};

const StyledHolst = styled.div`
  background-color: white;
`;

export default React.memo(Holst);
