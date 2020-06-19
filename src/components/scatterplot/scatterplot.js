import React from 'react'
import Plot from 'react-plotly.js';
import {useSettings} from '../../modules/settings/settings'
import {useMolecules} from '../../modules/molecules/molecules'
import {useMoleculesSelection, selectMolecules} from '../../modules/plot-selection-molecules/plot-selection-molecules'

export const ScatterPlot = () => {
    const molecules = useMolecules();
    const settings = useSettings();
    const moleculesSelection = useMoleculesSelection();

    const mkColor = settings.color
    const xaxis = molecules.map(molecule => molecule.scores.filter(score => score.name === settings.xprop).map(score => score.value)[0])
    const yaxis = molecules.map(molecule => molecule.scores.filter(score => score.name === settings.yprop).map(score => score.value)[0])

    const handleSelection = (points) => {
        let mols = converPointsToMolecules(points);
        selectMolecules(mols);
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

    return (
        <Plot
            data={[
                {
                    x: xaxis,
                    y: yaxis,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: mkColor}
                }
            ]}
            layout={{ width: 1000, height: 1000, title: 'Scatter plot component', dragmode: 'select' }}
            onSelected={(e) => handleSelection(e.points)}
            onRelayout={(...e) => console.log(e)}
        />
    );
};