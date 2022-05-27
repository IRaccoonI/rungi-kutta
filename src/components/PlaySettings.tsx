import React from "react";
import InputSlider from "react-input-slider";
import styled from "styled-components";
import { MAX_DEPS } from "../constants/rungi";

interface PlaySettingsProps {
  nIter: number;
  onChangeNIter: (newN: number) => void;
  hIter: number;
  onChangeHIter: (newH: number) => void;
  maxPointHistoryDeps: number;
  onChangeMaxPointHistoryDeps: (newVal: number) => void;
}

const PlaySettings: React.FC<PlaySettingsProps> = ({
  nIter,
  onChangeNIter,
  hIter,
  onChangeHIter,
  maxPointHistoryDeps,
  onChangeMaxPointHistoryDeps,
}) => {
  return (
    <WrapperForm className="px-1">
      <div className="d-flex align-items-center w-100 mb-2">
        <HintSlider className="me-3">HistDeps:</HintSlider>
        <InputSlider
          axis="x"
          x={maxPointHistoryDeps}
          onChange={({ x }) => onChangeMaxPointHistoryDeps(x)}
          xstep={1}
          xmin={1}
          xmax={100}
          styles={{
            track: { width: "100%" },
            thumb: { backgroundColor: "#000" },
          }}
        />
        <SliderLabel className="ms-2">{maxPointHistoryDeps}</SliderLabel>
      </div>
      <div className="d-flex align-items-center w-100 mb-2">
        <HintSlider className="me-3">Iter:</HintSlider>
        <InputSlider
          axis="x"
          x={nIter}
          onChange={({ x }) => onChangeNIter(x)}
          xstep={1}
          xmin={1}
          xmax={MAX_DEPS}
          styles={{
            track: { width: "100%" },
            thumb: { backgroundColor: "#000" },
          }}
        />
        <SliderLabel className="ms-2">{nIter}</SliderLabel>
      </div>

      <div className="d-flex align-items-center w-100">
        <HintSlider className="me-3">Rungi t:</HintSlider>
        <InputSlider
          axis="x"
          x={hIter}
          onChange={({ x }) => onChangeHIter(x)}
          xstep={0.01}
          xmin={0}
          xmax={5}
          styles={{
            track: { width: "100%" },
            thumb: { backgroundColor: "#000" },
          }}
        />
        <SliderLabel className="ms-2">
          {Math.round(hIter * 100) / 100}
        </SliderLabel>
      </div>
    </WrapperForm>
  );
};

const WrapperForm = styled.div`
  width: 1000px;
`;

const SliderLabel = styled.span`
  width: 32px;
`;

const HintSlider = styled.span`
  width: 70px;
`;

export default React.memo(PlaySettings);
