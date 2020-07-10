import { Datum, PlotDatum, PlotSelectionEvent } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { isNotUndefined, isUndefined } from '../../utils';
import { useScatterplotConfiguration } from './plotConfiguration';
import { selectPoints } from './plotSelection';
import ScatterplotConfiguration from './ScatterplotConfiguration';

interface SelectionPlotDatum extends PlotDatum {
  customdata: Datum;
}

const getPropArrayFromMolecules = (molecules: Molecule[], prop: string | null) => {
  return molecules.map((molecule) => molecule.scores.find((m) => m.name === prop)?.value);
};

const ScatterPlot = () => {
  const { molecules, scoresNames } = useMolecules();

  let { xprop, yprop, size, colour: mkColor } = useScatterplotConfiguration();

  let xaxis = getPropArrayFromMolecules(molecules, xprop);
  if (xaxis.every(isUndefined)) {
    xaxis = molecules.map((mol) => mol.id);
    xprop = 'id';
  }
  let yaxis = getPropArrayFromMolecules(molecules, yprop);
  if (yaxis.every(isUndefined)) {
    yaxis = molecules.map((mol) => mol.id);
    yprop = 'id';
  }
  let colouraxis: (number | undefined)[] | number = getPropArrayFromMolecules(molecules, mkColor);
  if (colouraxis.every(isUndefined)) {
    colouraxis = 1;
  }
  let sizeaxis: (number | undefined)[] | number = getPropArrayFromMolecules(molecules, size);
  if (sizeaxis.every(isUndefined)) {
    sizeaxis = 10;
  } else {
    // Scale points to
    const min = Math.min(...sizeaxis.filter(isNotUndefined));
    const max = Math.max(...sizeaxis.filter(isNotUndefined));

    sizeaxis = sizeaxis.map((v) => {
      if (v !== undefined) {
        return (25 * (v - min)) / max;
      }
      return v;
    });
  }

  const handleSelection = ({ points }: Readonly<PlotSelectionEvent>) => {
    // @types is missing the customdata field in the type definitions
    selectPoints(points.map((p) => (p as SelectionPlotDatum).customdata) as number[]);
  };

  return (
    <>
      <ScatterplotConfiguration properties={scoresNames} />
      <Plot
        data={[
          {
            x: xaxis as number[],
            y: yaxis as number[],
            customdata: molecules.map((m) => m.id), // Add custom data for use in selection
            type: 'scatter',
            mode: 'markers',
            marker: {
              color: colouraxis as number[],
              size: sizeaxis as number[],
              reversescale: true,
              colorscale: 'Bluered',
            },
          },
        ]}
        layout={{
          width: 480,
          height: 480,
          margin: { t: 10, r: 10, b: 50, l: 50 },
          dragmode: 'select',
          xaxis: { title: xprop ?? 'Select a property to display' },
          yaxis: { title: yprop ?? 'Select a property to display' },
        }}
        onSelected={handleSelection}
      />
    </>
  );
};

export default ScatterPlot;
