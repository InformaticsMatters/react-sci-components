import React from 'react';

import { Datum } from 'plotly.js';
import Plot from 'react-plotly.js';

import { Typography, useTheme } from '@material-ui/core';

import { Molecule, useMolecules } from '../../modules/molecules/molecules';
import { isNumber, isUndefined } from '../../utils';
import { useScatterplotConfiguration } from './plotConfiguration';
import { selectPoints } from './plotSelection';

const getPropArrayFromMolecules = (molecules: Molecule[], prop: string | null) => {
  if (prop === 'id') {
    return molecules.map((molecules) => molecules.id);
  } else {
    return molecules.map((molecule) => molecule.fields.find((m) => m.name === prop)?.value);
  }
};

/* Gets the axis display text of the curried prop name */
const getPropDisplayName = (names: string[], nicknames: string[]) => (prop: string | null) => {
  if (prop !== null) {
    const idx = names.indexOf(prop);
    if (idx !== -1) {
      return nicknames[idx];
    } else {
      return prop;
    }
  } else {
    return 'Select a property to display';
  }
};

// Types

type AxisSeries = ReturnType<typeof getPropArrayFromMolecules> | number;

interface IProps {
  width: number;
}

const ScatterPlot = ({ width }: IProps) => {
  const theme = useTheme();
  const { molecules, fieldNames, fieldNickNames } = useMolecules();

  let { xprop, yprop, size, colour } = useScatterplotConfiguration();

  let xaxis = getPropArrayFromMolecules(molecules, xprop);
  let yaxis = getPropArrayFromMolecules(molecules, yprop);

  let colouraxis: AxisSeries = getPropArrayFromMolecules(molecules, colour);
  if (colouraxis.every(isUndefined)) {
    colouraxis = 1;
  }
  let sizeaxis: AxisSeries = getPropArrayFromMolecules(molecules, size);
  if (sizeaxis.every(isNumber)) {
    // Scale points to
    const min = Math.min(...sizeaxis.filter(isNumber));
    const max = Math.max(...sizeaxis.filter(isNumber));

    sizeaxis = sizeaxis.map((v) => {
      if (v !== undefined && typeof v !== 'string') {
        return (45 * (v - min)) / max + 5;
      }
      return v;
    });
  } else {
    sizeaxis = 10;
  }

  const labelGetter = getPropDisplayName(fieldNames, fieldNickNames);
  const xlabel = labelGetter(xprop);
  const ylabel = labelGetter(yprop);

  const displayWidth = width - 2 * theme.spacing(2);
  return (
    <>
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
              colorbar: {},
            },
          },
        ]}
        layout={{
          width: displayWidth,
          // height: displayWidth,
          margin: { t: 10, r: 10, b: 50, l: 50 },
          dragmode: 'select',
          hovermode: 'closest',
          xaxis: { title: xlabel },
          yaxis: { title: ylabel },
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
      {!!colour && (
        <Typography variant="body2" align="center">
          <b>Colour</b>: {labelGetter(colour)}
        </Typography>
      )}
      {!!size && (
        <Typography variant="body2" align="center">
          <b>Size</b>: {labelGetter(size)}
        </Typography>
      )}
    </>
  );
};

export default ScatterPlot;
