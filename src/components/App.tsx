import React from "react";
import { Button } from "react-bootstrap";
import { GearFill, PlayFill } from "react-bootstrap-icons";
import styled, { createGlobalStyle } from "styled-components";
import { MAX_POINTS_HISTORY_DEPS } from "../constants/holst";
import { RungiModel } from "../constants/models";
import { MAX_DEPS } from "../constants/rungi";
import {
  lenPts,
  model1,
  model1NextFrame,
  model2,
  powSumSqrt,
} from "../sevices/rungiKutta";
import { MaterialPoint, Point } from "../types/metric";
import { Dimensions } from "../types/sizing";
import FloatingWindow from "./FloatingWindow";
import HistoryPoints from "./HistoryPoints";
import Holst from "./Holst";
import ModelSettings from "./ModelSettings";
import PlaySettings from "./PlaySettings";

function App() {
  const [holstDimensions, holstSetDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const holstCenter = React.useMemo<Point>(() => {
    return { x: holstDimensions.width / 2, y: holstDimensions.height / 2 };
  }, [holstDimensions]);

  const [model, setModel] = React.useState(RungiModel.MODEL1);

  const [initMaterialPoints, setInitMaterialPoints] = React.useState<
    MaterialPoint[]
  >([]);

  const handleChangeInitMaterialPoints = React.useCallback(
    (newMPts: MaterialPoint[]) => {
      setInitMaterialPoints(
        newMPts.map((mPt, idx, arr) => {
          if (mPt.velocity && model === RungiModel.MODEL1) {
            const mPtTarget = idx === arr.length - 1 ? arr[0] : arr[idx + 1];

            const velocityVal = powSumSqrt(mPt.velocity.x, mPt.velocity.y);
            const velocity = {
              x:
                (velocityVal * (mPtTarget.point.x - mPt.point.x)) /
                lenPts(mPt, mPtTarget),
              y:
                (velocityVal * (mPtTarget.point.y - mPt.point.y)) /
                lenPts(mPt, mPtTarget),
            };
            return {
              ...mPt,
              velocity,
            };
          }
          return mPt;
        })
      );
    },
    [model]
  );

  React.useEffect(() => {
    if (model === RungiModel.MODEL1) {
      handleChangeInitMaterialPoints(initMaterialPoints);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const [isSettingShow, setIsSettingShow] = React.useState(true);
  const [isPlaySettingShow, setIsPlaySettingShow] = React.useState(false);
  const [nIter, setNIter] = React.useState(1);
  const [hIter, setHIter] = React.useState(1);
  const [maxPointHistoryDeps, setMaxPointHistoryDeps] = React.useState(
    MAX_POINTS_HISTORY_DEPS
  );

  const handleIsSettingShow = React.useCallback((newVal: boolean) => {
    // if (newVal) setIsPlaySettingShow(false);
    setIsSettingShow(newVal);
  }, []);

  const handleIsPlaySettingShow = React.useCallback((newVal: boolean) => {
    // if (newVal) setIsSettingShow(false);
    setIsPlaySettingShow(newVal);
  }, []);

  const allMaterialPointsHistory = React.useMemo(() => {
    if (!isPlaySettingShow) return [];

    const arr: MaterialPoint[][] = Array(MAX_DEPS).fill(initMaterialPoints);

    const curModel = model === RungiModel.MODEL1 ? model1 : model2;

    let prevRes: MaterialPoint[] | null = null;
    return arr.map((mPts) => {
      prevRes = prevRes ? model1NextFrame(curModel, prevRes, hIter) : mPts;
      return prevRes;
    });
  }, [hIter, initMaterialPoints, isPlaySettingShow, model]);

  const materialPointsHistory = React.useMemo(() => {
    if (!isPlaySettingShow) return [];

    return allMaterialPointsHistory.slice(0, nIter);
  }, [allMaterialPointsHistory, isPlaySettingShow, nIter]);

  React.useEffect(() => {
    setNIter(1);
  }, [isPlaySettingShow]);

  return (
    <StyledApp>
      {/* Сорри очень плохой код;( */}
      <GlobalStyle />

      <ToolButtons>
        <Button
          variant="outline-success"
          onClick={() => handleIsSettingShow(!isSettingShow)}
          active={isSettingShow}
          className="me-1"
        >
          <GearFill size={26.5} />
        </Button>
        <Button
          variant="outline-success"
          onClick={() => handleIsPlaySettingShow(!isPlaySettingShow)}
          active={isPlaySettingShow}
        >
          <PlayFill size={26.5} />
        </Button>
      </ToolButtons>
      <FloatingWindow isShow={isSettingShow} position={{ top: 60, right: 9 }}>
        <ModelSettings
          materialPoints={initMaterialPoints}
          onChangeMaterialPoints={handleChangeInitMaterialPoints}
          initPointPosition={holstCenter}
          model={model}
          onChangeModel={setModel}
        />
      </FloatingWindow>

      <FloatingWindow
        isShow={isPlaySettingShow}
        position={{ bottom: 9, right: 9 }}
      >
        <PlaySettings
          nIter={nIter}
          onChangeNIter={setNIter}
          hIter={hIter}
          onChangeHIter={setHIter}
          maxPointHistoryDeps={maxPointHistoryDeps}
          onChangeMaxPointHistoryDeps={setMaxPointHistoryDeps}
        />
      </FloatingWindow>
      <WrapperHolst>
        {isPlaySettingShow ? (
          <HistoryPoints
            materialPointsHistory={materialPointsHistory}
            maxPointHistoryDeps={maxPointHistoryDeps}
          />
        ) : (
          <Holst
            initMaterialPoints={initMaterialPoints}
            onChangeMaterialPoints={handleChangeInitMaterialPoints}
            onResize={holstSetDimensions}
          />
        )}
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
