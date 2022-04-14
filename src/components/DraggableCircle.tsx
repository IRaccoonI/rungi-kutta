import React from "react";
import { Point } from "../types/metric";

interface DraggableCircleProps {
  position: Point;
  onChangePosition: (newPt: Point) => unknown;
}

const DraggableCircle: React.FC<DraggableCircleProps> = ({
  position,
  onChangePosition,
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
      r={4}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      fill={isActive ? "blue" : "black"}
    />
  );
};

export default React.memo(DraggableCircle);
