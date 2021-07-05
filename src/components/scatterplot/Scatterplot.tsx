import React, { useState } from 'react';

import { Datum } from 'plotly.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import styled from 'styled-components';

import { Switch, Tooltip, Typography, useTheme } from '@material-ui/core';

import { FieldMeta, Molecule, useMolecules } from '../../modules/molecules/molecules';
import { isNumber } from '../../utils';
import { useScatterplotConfiguration } from './plotConfiguration';
import { selectPoints, usePlotSelection } from './plotSelection';

const Plot = createPlotlyComponent(Plotly);

// Utils

const getPropArrayFromMolecules = (molecules: Molecule[], prop: string | null) => {
  if (prop === 'id') {
    return molecules.map((molecule) => molecule.id);
  } else {
    return molecules.map(
      (molecule) => molecule.fields.find((field) => field.name === prop)?.value ?? null,
    );
  }
};

type AxisSeries = ReturnType<typeof getPropArrayFromMolecules>;

/* Gets the axis display text of the curried prop name */
const getPropDisplayName = (fields: FieldMeta[]) => (prop: string | null) => {
  if (prop !== null) {
    return fields.find((f) => f.name === prop)?.nickname ?? prop;
  } else {
    return 'Select a property to display';
  }
};

const scaleToSize = (sizeaxis: AxisSeries) => {
  if (sizeaxis.every(isNumber)) {
    const sx = sizeaxis as number[];
    const min = Math.min(...sx);
    const max = Math.max(...sx);

    const scaledSizes = sx.map((v) => (45 * (v - min)) / max + 5);

    return { sizes: scaledSizes, min, max };
  }
  return { sizes: 10 };
};

const validateColours = (colouraxis: AxisSeries) => {
  if (colouraxis.every(isNumber)) {
    const cx = colouraxis as number[];

    const min = Math.min(...cx);
    const max = Math.max(...cx);

    return { colours: colouraxis, min, max };
  }
  return { colours: 1 };
};

interface IProps {
  width: number;
  colourBar?: boolean;
}

const ScatterPlot = ({ width, colourBar = false }: IProps) => {
  const theme = useTheme();
  const { molecules, fields } = useMolecules();

  const { xprop, yprop, size, colour } = useScatterplotConfiguration();
  const selection = usePlotSelection();

  const selectedPoints = selection.map((id) => molecules.findIndex((m) => m.id === id));

  const [showColourBar, setShowColourBar] = useState(false);

  const xaxis = getPropArrayFromMolecules(molecules, xprop);
  const yaxis = getPropArrayFromMolecules(molecules, yprop);

  const sizeaxis = getPropArrayFromMolecules(molecules, size);
  const colouraxis = getPropArrayFromMolecules(molecules, colour);

  const { sizes, ...sizeExtent } = scaleToSize(sizeaxis);
  const { colours, ...colourExtent } = validateColours(colouraxis);

  const labelGetter = getPropDisplayName(fields);
  const xlabel = labelGetter(xprop);
  const ylabel = labelGetter(yprop);

  const displayWidth = width - 2 * theme.spacing(2);

  return (
    <>
      <Plot
        config={{
          modeBarButtonsToRemove: [
            'resetScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'toImage',
            'toggleSpikelines',
          ],
        }}
        data={[
          {
            x: xaxis,
            y: yaxis,
            customdata: molecules.map((m) => m.id), // Add custom data for use in selection
            selectedpoints: selectedPoints.length ? selectedPoints : null,
            type: 'scatter',
            mode: 'markers',
            marker: {
              color: colours,
              size: sizes,
              colorscale: 'Bluered',
              colorbar: showColourBar || colourBar ? {} : undefined,
            },
          } as any,
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
        onDeselect={() => selectPoints([])}
        onSelected={(event) => {
          // @types is wrong here, we need `?.` as points can be undefined (double click event)
          const points = event?.points;

          // Waiting for @types fix for plotly here to remove the assertion
          points &&
            selectPoints(
              points.map((p) => (p as typeof p & { customdata: Datum }).customdata) as number[],
            );
        }}
      />
      {!!colour && (
        <ColourLabel>
          <Tooltip arrow title="Toggle the colour bar">
            <Switch checked={showColourBar} onChange={() => setShowColourBar(!showColourBar)} />
          </Tooltip>
          <Typography display="inline" variant="body2">
            <b>Colour</b>: {labelGetter(colour)}
            <br />
            <em>
              (
              {colourExtent.min !== undefined &&
                colourExtent.max !== undefined &&
                `${colourExtent.min}–${colourExtent.max}`}
              )
            </em>
          </Typography>
        </ColourLabel>
      )}
      {!!size && (
        <Typography style={{ marginLeft: 58 }} variant="body2">
          <b>Size</b>: {labelGetter(size)}
          <br />
          <em>
            (
            {sizeExtent.min !== undefined &&
              sizeExtent.max !== undefined &&
              `${sizeExtent.min}–${sizeExtent.max}`}
            )
          </em>
        </Typography>
      )}
    </>
  );
};

export default React.memo(ScatterPlot);

const ColourLabel = styled.div`
  display: flex;
`;
