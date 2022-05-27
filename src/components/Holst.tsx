import React from "react";
import styled from "styled-components";
import { MaterialPoint, Point } from "../types/metric";
import { Dimensions } from "../types/sizing";
import DraggableCircle from "./DraggableCircle";
import Vector from "./Vector";

interface HolstProps {
  initMaterialPoints: MaterialPoint[];
  onChangeMaterialPoints: (newPts: MaterialPoint[]) => unknown;
  onResize: (arg: Dimensions) => unknown;
}

const Holst: React.FC<HolstProps> = ({
  initMaterialPoints: materialPoints,
  onResize: onResizeHolst,
  onChangeMaterialPoints,
}) => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    onResizeHolst(dimensions);
  }, [dimensions, onResizeHolst]);

  const onResize = React.useCallback(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  const onUpdatePoint = React.useCallback(
    (newPoint: MaterialPoint, index: number) => {
      const newPoints = materialPoints.map((pt, idx) =>
        idx === index ? newPoint : pt
      );
      onChangeMaterialPoints(newPoints);
    },
    [materialPoints, onChangeMaterialPoints]
  );

  const onChangePtPosition = React.useCallback(
    (idx: number) => {
      return (newPosition: Point) => {
        onUpdatePoint({ ...materialPoints[idx], point: newPosition }, idx);
      };
    },
    [materialPoints, onUpdatePoint]
  );

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
        {materialPoints.map(
          ({ point, velocity, color = "#000", weight }, idx) => {
            return (
              <>
                <DraggableCircle
                  key={idx + "_1"}
                  position={point}
                  onChangePosition={onChangePtPosition(idx)}
                  color={color}
                  radius={weight}
                />
                {velocity &&
                (Math.abs(velocity.x) > 0.001 ||
                  Math.abs(velocity.y) > 0.001) ? (
                  <Vector
                    key={idx + "_2"}
                    position={point}
                    vector={velocity}
                    color={color}
                  />
                ) : null}
              </>
            );
          }
        )}
      </svg>
    </StyledHolst>
  );
};

const StyledHolst = styled.div`
  background-color: white;
`;

export default React.memo(Holst);
