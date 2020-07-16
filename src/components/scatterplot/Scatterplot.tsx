import { Datum } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { isNotUndefined, isUndefined } from '../../utils';
import { useScatterplotConfiguration } from './plotConfiguration';
import { selectPoints } from './plotSelection';
import ScatterplotConfiguration from './ScatterplotConfiguration';

const getPropArrayFromMolecules = (molecules: Molecule[], prop: string | null) => {
  if (prop === 'id') {
    return molecules.map((molecules) => molecules.id);
  } else {
    return molecules.map((molecule) => molecule.scores.find((m) => m.name === prop)?.value);
  }
};

const ScatterPlot = () => {
  const { molecules, scoresNames } = useMolecules();

  let { xprop, yprop, size, colour } = useScatterplotConfiguration();

  let xaxis = getPropArrayFromMolecules(molecules, xprop);
  let yaxis = getPropArrayFromMolecules(molecules, yprop);

  let colouraxis: (number | undefined)[] | number = getPropArrayFromMolecules(molecules, colour);
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
              colorscale: 'Bluered',
            },
          },
        ]}
        layout={{
          width: 480,
          height: 480,
          margin: { t: 10, r: 10, b: 50, l: 50 },
          dragmode: 'select',
          hovermode: 'closest',
          xaxis: { title: xprop ?? 'Select a property to display' },
          yaxis: { title: yprop ?? 'Select a property to display' },
        }}
        config={{
          modeBarButtonsToRemove: [
            'resetScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'toImage',
            'toggleSpikelines',
          ],
        }}
        onSelected={(event) => {
          // @types is wrong here, we need `?.` as points can be undefined (double click event)
          const points = event?.points;

          // Waiting for @types fix for plotly here to remove the assertion
          points &&
            selectPoints(
              points.map((p) => (p as typeof p & { customdata: Datum }).customdata) as number[],
            );
        }}
        onDeselect={() => selectPoints([])}
      />
    </>
  );
};

export default ScatterPlot;
