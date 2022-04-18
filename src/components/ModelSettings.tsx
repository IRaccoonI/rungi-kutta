import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Dash, Plus } from "react-bootstrap-icons";
import styled from "styled-components";
import { RungiModel } from "../constants/models";
import { randomDarkColor } from "../lib/color";
import { powSumSqrt } from "../sevices/rungiKutta";
import { MaterialPoint, PerfectModel, Point } from "../types/metric";

interface ModelSettingsProps {
  materialPoints: MaterialPoint[];
  onChangeMaterialPoints: (newPoints: MaterialPoint[]) => unknown;
  initPointPosition?: Point;
  headerControl?: React.ReactElement;
  model: RungiModel;
  onChangeModel: (newModel: RungiModel) => void;
}

const generateMaterialPointsFromPerfectModel1 = (
  model: PerfectModel,
  center: Point
): MaterialPoint[] => {
  const r = model.a / (2 * Math.sin(Math.PI / model.n));
  const alpha = (Math.PI * 2) / model.n;

  const resPoint = Array(model.n)
    .fill(1)
    .map((_, idx): MaterialPoint => {
      return {
        point: {
          x: center.x + Math.cos(alpha * idx) * r,
          y: center.y + Math.sin(alpha * idx) * r,
        },
        weight: 1,
      };
    });

  return resPoint.map((mPt, idx, arr) => {
    const ptTarget = idx !== arr.length - 1 ? arr[idx + 1] : arr[0];

    return {
      ...mPt,
      velocity: {
        x: model.v * ((ptTarget.point.x - mPt.point.x) / model.a),
        y: model.v * ((ptTarget.point.y - mPt.point.y) / model.a),
      },
      color: randomDarkColor(),
    };
  });
};

const generateMaterialPointsFromPerfectModel2 = (
  model: PerfectModel,
  center: Point
): MaterialPoint[] => {
  const r = model.a / (2 * Math.sin(Math.PI / model.n));
  const alpha = (Math.PI * 2) / model.n;

  const resPoint = Array(model.n)
    .fill(1)
    .map((_, idx): MaterialPoint => {
      return {
        point: {
          x: center.x + Math.cos(alpha * idx) * r,
          y: center.y + Math.sin(alpha * idx) * r,
        },
        weight: model.mPts || 1,
      };
    });

  return [
    ...resPoint.map((mPt, idx, arr) => {
      return {
        ...mPt,
        velocity: {
          x: model.v * ((center.y - mPt.point.y) / model.a),
          y: model.v * ((mPt.point.x - center.x) / model.a),
        },
        color: randomDarkColor(),
      };
    }),
    {
      point: center,
      color: randomDarkColor(),
      weight: model.mCenterPt || 1,
    },
  ];
};

const ModelSettings: React.FC<ModelSettingsProps> = ({
  materialPoints,
  onChangeMaterialPoints,
  initPointPosition,
  model,
  onChangeModel,
}) => {
  const onUpdatePoint = React.useCallback(
    (newPoint: MaterialPoint, index: number) => {
      const newPoints = materialPoints.map((pt, idx) =>
        idx === index ? newPoint : pt
      );
      onChangeMaterialPoints(newPoints);
    },
    [materialPoints, onChangeMaterialPoints]
  );

  const addPoint = React.useCallback(() => {
    onChangeMaterialPoints([
      ...materialPoints,
      {
        point: initPointPosition ? initPointPosition : { x: 0, y: 0 },
        weight: 1,
      },
    ]);
  }, [initPointPosition, materialPoints, onChangeMaterialPoints]);

  const deletePoint = React.useCallback(
    (index: number) => {
      return () =>
        onChangeMaterialPoints(
          materialPoints.filter((_, idx) => idx !== index)
        );
    },
    [materialPoints, onChangeMaterialPoints]
  );

  const [isPerfectModel, setIsPerfectModel] = React.useState(false);
  const [perfectModelSettings, setPerfectModelSettings] =
    React.useState<PerfectModel>({ n: 4, a: 100, v: 15 });

  React.useEffect(() => {
    if (!isPerfectModel) return;

    if (model === RungiModel.MODEL1)
      onChangeMaterialPoints(
        generateMaterialPointsFromPerfectModel1(
          perfectModelSettings,
          initPointPosition || { x: 500, y: 500 }
        )
      );
    if (model === RungiModel.MODEL2)
      onChangeMaterialPoints(
        generateMaterialPointsFromPerfectModel2(
          perfectModelSettings,
          initPointPosition || { x: 500, y: 500 }
        )
      );
  }, [
    perfectModelSettings,
    isPerfectModel,
    onChangeMaterialPoints,
    initPointPosition,
    model,
  ]);

  return (
    <StyledForm>
      <Row className="mb-3">
        <Col sm={6}>
          <Button
            className="w-100"
            size="sm"
            disabled={model === RungiModel.MODEL1}
            onClick={() => onChangeModel(RungiModel.MODEL1)}
          >
            Модель 1
          </Button>
        </Col>
        <Col sm={6}>
          <Button
            className="w-100"
            size="sm"
            disabled={model === RungiModel.MODEL2}
            onClick={() => onChangeModel(RungiModel.MODEL2)}
          >
            Модель 2
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6} className="">
          <div className="d-flex align-items-center  h-100">
            <Form.Check
              type="switch"
              label="Идеальная модель"
              checked={isPerfectModel}
              onClick={() => setIsPerfectModel((p) => !p)}
            />
          </div>
        </Col>

        <Form.Label column sm={1}>
          n:
        </Form.Label>
        <Col sm={5}>
          <Form.Control
            disabled={!isPerfectModel}
            type="number"
            value={perfectModelSettings.n}
            onChange={({ target: { value: newValue } }) => {
              setPerfectModelSettings({
                ...perfectModelSettings,
                n: Number(newValue),
              });
            }}
          />
        </Col>

        <div className="w-100 mb-2"></div>

        <Form.Label column sm={1}>
          a:
        </Form.Label>
        <Col sm={5}>
          <Form.Control
            disabled={!isPerfectModel}
            type="number"
            value={perfectModelSettings.a}
            onChange={({ target: { value: newValue } }) => {
              setPerfectModelSettings({
                ...perfectModelSettings,
                a: Number(newValue),
              });
            }}
          />
        </Col>

        <Form.Label column sm={1}>
          V:
        </Form.Label>
        <Col sm={5}>
          <Form.Control
            disabled={!isPerfectModel}
            type="number"
            value={perfectModelSettings.v}
            onChange={({ target: { value: newValue } }) => {
              setPerfectModelSettings({
                ...perfectModelSettings,
                v: Number(newValue),
              });
            }}
          />
        </Col>

        <div className="w-100 mb-2"></div>
        {model === RungiModel.MODEL2 ? (
          <>
            <Form.Label column sm={1}>
              mPts:
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                disabled={!isPerfectModel}
                type="number"
                value={perfectModelSettings.mPts || 1}
                onChange={({ target: { value: newValue } }) => {
                  setPerfectModelSettings({
                    ...perfectModelSettings,
                    mPts: Number(newValue),
                  });
                }}
              />
            </Col>

            <Form.Label column sm={1}>
              mCPt:
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                disabled={!isPerfectModel}
                type="number"
                value={perfectModelSettings.mCenterPt || 1}
                onChange={({ target: { value: newValue } }) => {
                  setPerfectModelSettings({
                    ...perfectModelSettings,
                    mCenterPt: Number(newValue),
                  });
                }}
              />
            </Col>
          </>
        ) : null}
      </Row>

      {materialPoints.map((mPt, idx, arr) => {
        return (
          <Form.Group as={Row} key={idx} className="mb-2">
            <Form.Label column sm={1}>
              x:
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                disabled={isPerfectModel}
                value={mPt.point.x}
                onChange={({ target: { value: newValue } }) => {
                  onUpdatePoint(
                    { ...mPt, point: { ...mPt.point, x: Number(newValue) } },
                    idx
                  );
                }}
              />
            </Col>
            <Form.Label column sm={1}>
              y:
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                disabled={isPerfectModel}
                value={mPt.point.y}
                onChange={({ target: { value: newValue } }) => {
                  onUpdatePoint(
                    { ...mPt, point: { ...mPt.point, y: Number(newValue) } },
                    idx
                  );
                }}
              />
            </Col>
            <Col sm={2}>
              <Button
                disabled={isPerfectModel}
                size="sm"
                className="w-100"
                variant="danger"
                onClick={deletePoint(idx)}
              >
                <Dash size={21} />
              </Button>
            </Col>

            <div className="w-100 mb-2"></div>
            {model === RungiModel.MODEL1 ? (
              <>
                <Form.Label column sm={1}>
                  V:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="number"
                    disabled={isPerfectModel}
                    value={
                      mPt.velocity
                        ? Math.round(
                            powSumSqrt(mPt.velocity.x, mPt.velocity.y) * 10
                          ) / 10
                        : 0
                    }
                    onChange={({ target: { value: newValue } }) => {
                      const newVelocity = {
                        x: Number(newValue),
                        y: 0,
                      };
                      onUpdatePoint({ ...mPt, velocity: newVelocity }, idx);
                    }}
                  />
                </Col>
              </>
            ) : (
              <>
                <Form.Label column sm={1}>
                  Vx:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="number"
                    disabled={isPerfectModel}
                    value={
                      mPt.velocity?.x ? Math.round(mPt.velocity.x * 10) / 10 : 0
                    }
                    onChange={({ target: { value: newValue } }) => {
                      const newVelocity =
                        mPt.velocity?.y === 0 && +newValue === 0
                          ? undefined
                          : { x: Number(newValue), y: mPt.velocity?.y || 0 };
                      onUpdatePoint({ ...mPt, velocity: newVelocity }, idx);
                    }}
                  />
                </Col>

                <Form.Label column sm={1}>
                  Vy:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="number"
                    disabled={isPerfectModel}
                    value={
                      mPt.velocity?.y ? Math.round(mPt.velocity.y * 10) / 10 : 0
                    }
                    onChange={({ target: { value: newValue } }) => {
                      const newVelocity =
                        mPt.velocity?.x === 0 && +newValue === 0
                          ? undefined
                          : { x: mPt.velocity?.x || 0, y: Number(newValue) };
                      onUpdatePoint({ ...mPt, velocity: newVelocity }, idx);
                    }}
                  />
                </Col>

                <div className="w-100 mb-2"></div>
                <Form.Label column sm={1}>
                  m:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="number"
                    disabled={isPerfectModel}
                    value={mPt.weight || 0}
                    onChange={({ target: { value: newValue } }) => {
                      onUpdatePoint({ ...mPt, weight: Number(newValue) }, idx);
                    }}
                  />
                </Col>
              </>
            )}
            <div className="w-100 mb-2"></div>
          </Form.Group>
        );
      })}
      <Button
        size="sm"
        className="w-100"
        disabled={isPerfectModel}
        onClick={addPoint}
      >
        <Plus size={21} />
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled(Form)`
  width: 450px;
`;

export default React.memo(ModelSettings);
