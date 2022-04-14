import React from "react";
import { Point } from "../types/metric";
interface VectorProps {
  vector: Point;
  position: Point;
}

const Vector: React.FC<VectorProps> = ({ vector, position }) => {
  return (
    <line
      x1={position.x}
      y1={position.y}
      x2={position.x + vector.x}
      y2={position.y + vector.y}
      stroke="#000"
      stroke-width="1"
      marker-end="url(#arrowhead)"
    />
  );
};

export default React.memo(Vector);
