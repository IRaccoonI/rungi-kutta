import React from "react";
import { CIRCLE_RADIUS } from "../constants/holst";
import { Point } from "../types/metric";

interface DraggableCircleProps {
  position: Point;
  onChangePosition: (newPt: Point) => unknown;
  color?: string;
  radius?: number;
}

const DraggableCircle: React.FC<DraggableCircleProps> = ({
  position,
  onChangePosition,
  color = "#000",
  radius,
}) => {
  const [offset, setOffset] = React.useState<Point>({ x: 0, y: 0 });

  const [isActive, setIsActive] = React.useState(false);

  const handlePointerDown = (e: any) => {
    const el = e.target;
    const box = e.target.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    el.setPointerCapture(e.pointerId);
    setIsActive(true);
    setOffset({ x, y });
  };
  const handlePointerMove = (e: any) => {
    if (!isActive) return;

    const box = e.target.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const newX = position.x - (offset.x - x);
    const newY = position.y - (offset.y - y);

    onChangePosition({ x: newX, y: newY });
  };
  const handlePointerUp = (e: any) => {
    setIsActive(false);
    setOffset({
      ...offset,
    });
  };

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={CIRCLE_RADIUS * Math.sqrt(radius || 1 / 3)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      fill={isActive ? "blue" : color}
    />
  );
};

export default React.memo(DraggableCircle);
