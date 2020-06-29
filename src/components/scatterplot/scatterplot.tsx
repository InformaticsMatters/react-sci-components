import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import {useSettings} from '../../modules/settings/settings';
import {useMolecules} from '../../modules/molecules/molecules';
import {usePlotSelection, selectPoints} from './plot-selection';

export const ScatterPlot = () => {
    const [selectedPoints, setSelectedPoints] = useState({ x: [], y: [], n: [] });
    const molecules = useMolecules();
    const settings = useSettings();
    const moleculesSelection = usePlotSelection();

    const mkColor = settings.color
    const xaxis = molecules.map(molecule => molecule.scores.filter(score => score.name === settings.xprop).map(score => score.value)[0])
    const yaxis = molecules.map(molecule => molecule.scores.filter(score => score.name === settings.yprop).map(score => score.value)[0])

    const handleSelection = (points) => {
        const selectedData = {
            x: points.map((p) => p.x),
            y: points.map((p) => p.y),
            n: points.map((p) => p.pointNumber),
          };
        setSelectedPoints(selectedData);
        let mols = converPointsToMolecules(points);
        selectPoints(mols);
        points.map(p => console.log(`selected point x=${p.x} and y=${p.y}`));
    };

    const converPointsToMolecules = points => {
        return points.map(point => {
            return molecules.filter(molecule => {
                let xPropVal = molecule.scores.filter(score => score.name === settings.xprop)[0].value;
                let yPropVal = molecule.scores.filter(score => score.name === settings.yprop)[0].value;
                return xPropVal == point.x && yPropVal == point.y;
            });
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
                    marker: {color}
                }
            ]}
            layout={{ width: 1000, height: 1000, title: 'Scatter plot component', dragmode: 'select' }}
            onSelected={(e) => handleSelection(e.points)}
            onRelayout={(...e) => console.log(e)}
        />
    );
};