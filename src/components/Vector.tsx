import React from "react";
import { Point } from "../types/metric";
interface VectorProps {
  vector: Point;
  position: Point;
  color?: string;
}

const Vector: React.FC<VectorProps> = ({
  vector,
  position,
  color = "#000",
}) => {
  return (
    <line
      x1={position.x}
      y1={position.y}
      x2={position.x + vector.x}
      y2={position.y + vector.y}
      stroke={color}
      stroke-width="1"
      marker-end="url(#arrowhead)"
    />
  );
};

export default React.memo(Vector);
