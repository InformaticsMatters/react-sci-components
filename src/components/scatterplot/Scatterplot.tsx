import { Datum, PlotDatum, PlotSelectionEvent } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { isUndefined, isNumber } from '../../utils';
import { useScatterplotConfiguration } from './plotConfiguration';
import { selectPoints } from './plotSelection';
import ScatterplotConfiguration from './ScatterplotConfig';

// TODO: update @types/plotly.js to fix this
interface SelectionPlotDatum extends PlotDatum {
  customdata: Datum;
}

const getPropArrayFromMolecules = (molecules: Molecule[], prop: string | null) => {
  return molecules.map((molecule) => molecule.fields.find((m) => m.name === prop)?.value);
};

type AxisSeries = ReturnType<typeof getPropArrayFromMolecules> | number;

const ScatterPlot = () => {
  const { molecules, fieldNames } = useMolecules();

  let { xprop, yprop, size, colour: mkColor } = useScatterplotConfiguration();

  let xaxis: AxisSeries = getPropArrayFromMolecules(molecules, xprop);
  if (xaxis.every(isUndefined)) {
    xaxis = molecules.map((mol) => mol.id);
    xprop = 'id';
  }
  let yaxis: AxisSeries = getPropArrayFromMolecules(molecules, yprop);
  if (yaxis.every(isUndefined)) {
    yaxis = molecules.map((mol) => mol.id);
    yprop = 'id';
  }
  let colouraxis: AxisSeries = getPropArrayFromMolecules(molecules, mkColor);
  if (colouraxis.every(isNumber)) {
  } else {
    colouraxis = 1;
  }
  let sizeaxis: AxisSeries = getPropArrayFromMolecules(molecules, size);
  if (sizeaxis.every(isNumber)) {
    // Scale points to
    const min = Math.min(...sizeaxis.filter(isNumber));
    const max = Math.max(...sizeaxis.filter(isNumber));

    sizeaxis = sizeaxis.map((v) => {
      if (v !== undefined && typeof v !== 'string') {
        return (25 * (v - min)) / max;
      }
      return v;
    });
  } else {
    sizeaxis = 10;
  }

  const handleSelection = ({ points }: Readonly<PlotSelectionEvent>) => {
    // @types is missing the customdata field in the type definitions
    // TODO: This is fixed in latest @types/plotly.js
    selectPoints(points.map((p) => (p as SelectionPlotDatum).customdata) as number[]);
  };

  return (
    <>
      <ScatterplotConfiguration properties={fieldNames} />
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
        onRelayout={(...e) => console.log(e)}
      />
    </>
  );
};

export default ScatterPlot;
