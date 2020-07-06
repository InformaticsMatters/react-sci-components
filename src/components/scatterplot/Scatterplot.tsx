import { Datum, PlotDatum } from 'plotly.js';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';

import { useMolecules } from '../../modules/molecules/molecules';
import { useSettings } from '../../modules/settings/settings';
import { selectPoints } from './plotSelection';

type Selection = { x: Datum[]; y: Datum[]; n: number[] };

const ScatterPlot = () => {
  const [selectedPoints, setSelectedPoints] = useState<Selection>({ x: [], y: [], n: [] });
  const molecules = useMolecules();
  const settings = useSettings();

  const mkColor = settings.color;
  const xaxis = molecules.map(
    (molecule) =>
      molecule.scores
        .filter((score) => score.name === settings.xprop)
        .map((score) => score.value)[0],
  );
  const yaxis = molecules.map(
    (molecule) =>
      molecule.scores
        .filter((score) => score.name === settings.yprop)
        .map((score) => score.value)[0],
  );

  const handleSelection = (points: PlotDatum[]) => {
    const selectedData = {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      n: points.map((p) => p.pointNumber),
    };
    setSelectedPoints(selectedData);
    let molIds = convertPointsToMolecules(points);
    selectPoints(molIds);
    points.map((p) => console.log(`selected point x=${p.x} and y=${p.y}`));
  };

  const convertPointsToMolecules = (points: PlotDatum[]) => {
    return points.map((point) => {
      return molecules.filter((molecule) => {
        let xPropVal = molecule.scores.filter((score) => score.name === settings.xprop)[0].value;
        let yPropVal = molecule.scores.filter((score) => score.name === settings.yprop)[0].value;
        return xPropVal === point.x && yPropVal === point.y;
      })[0].id;
    });
  };

  let color = new Array(xaxis.length).fill(mkColor);
  selectedPoints.n.forEach((n) => {
    color[n] = 'orange';
  });

  return (
    <Plot
      data={[
        {
          x: xaxis,
          y: yaxis,
          type: 'scatter',
          mode: 'markers',
          marker: { color },
        },
      ]}
      layout={{
        width: 480,
        height: 480,
        margin: { t: 10, r: 10, b: 25, l: 30 },
        dragmode: 'select',
      }}
      onSelected={(e) => handleSelection(e.points)}
      onRelayout={(...e) => console.log(e)}
    />
  );
};

export default ScatterPlot;
