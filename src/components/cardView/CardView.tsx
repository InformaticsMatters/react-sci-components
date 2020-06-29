import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { usePlotSelection } from 'components/scatterplot/plot-selection';
import MolCard from './MolCard';
import CalculationsTable from './CalculationsTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
            gridGap: '1rem',
            overflow: 'auto',
            padding: '1rem',
        },
    }),
);
interface IProps {}

const CardView = () => {
    const classes = useStyles();

    const selectedMolecules = usePlotSelection();

    return (
        <div className={classes.root}>
            {selectedMolecules.map(({name, scores}) => (
                <MolCard smiles={name}>
                    <CalculationsTable properties={scores} />
                </MolCard>
            ))}
        </div>
    );
};

export default CardView;
