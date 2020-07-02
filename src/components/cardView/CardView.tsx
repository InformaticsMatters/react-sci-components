import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import { usePlotSelection } from '../scatterplot/plotSelection';
import CalculationsTable from './CalculationsTable';
import MolCard from './MolCard';

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
      {selectedMolecules.map(({ smiles, scores }) => {
        return (
          <MolCard smiles={smiles}>
            <CalculationsTable properties={scores} />
          </MolCard>
        );
      })}
    </div>
  );
};

export default CardView;
