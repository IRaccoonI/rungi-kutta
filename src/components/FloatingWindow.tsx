import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

interface FloatingWindowProps {
  children: React.ReactElement;
  isShow?: boolean;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  children,
  isShow,
}) => {
  return (
    <Draggable>
      <WrapperFloating className={isShow ? "" : "d-none"}>
        <Header />
        <div onMouseDown={(e) => e.stopPropagation()}>
          <ScrollWrapper className="p-2">{children}</ScrollWrapper>
        </div>
      </WrapperFloating>
    </Draggable>
  );
};

const Header = styled.div`
  height: 24px;
  border-bottom: 1px solid gray;
  cursor: move;
  user-select: none;
`;

const WrapperFloating = styled.div`
  z-index: 2;
  position: absolute;
  top: 60px;
  right: 9px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid gray;
`;

const ScrollWrapper = styled.div`
  max-height: 500px;
  width: 100%;
  overflow: auto;
`;

export default React.memo(FloatingWindow);
