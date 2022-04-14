import React from "react";
import { Button } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import styled, { createGlobalStyle } from "styled-components";
import { MaterialPoint, Point } from "../types/metric";
import { Dimensions } from "../types/sizing";
import FloatingWindow from "./FloatingWindow";
import Holst from "./Holst";
import ModelSettings from "./ModelSettings";

function App() {
  const [holstDimensions, holstSetDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const holstCenter = React.useMemo<Point>(() => {
    return { x: holstDimensions.width / 2, y: holstDimensions.height / 2 };
  }, [holstDimensions]);

  const [initMaterialPoints, setInitMaterialPoints] = React.useState<
    MaterialPoint[]
  >([]);

  const [isSettingShow, setIsSettingShow] = React.useState(true);

  // const [isMove, setIsMove] = React.useState(false);

  return (
    <StyledApp>
      {/* Сорри очень плохой код;( */}
      <GlobalStyle />

      <ToolButtons>
        <Button
          variant="outline-success"
          onClick={() => setIsSettingShow((p) => !p)}
          active={isSettingShow}
        >
          <GearFill size={26.5} />
        </Button>
      </ToolButtons>
      <FloatingWindow isShow={isSettingShow}>
        <ModelSettings
          materialPoints={initMaterialPoints}
          onChangeMaterialPoints={setInitMaterialPoints}
          initPointPosition={holstCenter}
          // headerControl={
          //   <Row>
          //     <Col sm={3}>
          //       <Button
          //         className="w-100 mb-2"
          //         size="sm"
          //         variant="outline-warning"
          //         active={isMove}
          //         onClick={() => setIsMove((p) => !p)}
          //       >
          //         <ArrowsMove size={21} />
          //       </Button>
          //     </Col>
          //   </Row>
          // }
        />
      </FloatingWindow>
      <WrapperHolst>
        <Holst
          initMaterialPoints={initMaterialPoints}
          onChangeMaterialPoints={setInitMaterialPoints}
          onResize={holstSetDimensions}
        />
      </WrapperHolst>
    </StyledApp>
  );
}

const GlobalStyle = createGlobalStyle`
  html {
    overflow: hidden;
  }
`;

const StyledApp = styled.div`
  height: 100vh;

  .btn:focus {
    box-shadow: none !important;
  }
`;

const WrapperHolst = styled.div`
  height: 100%;
  width: 100%;
  border: 8px solid gray;
`;

const ToolButtons = styled.div`
  position: absolute;
  top: 9px;
  right: 9px;
  height: 41.75px;
  z-index: 2;
  border-radius: 5px;
`;

export default App;
