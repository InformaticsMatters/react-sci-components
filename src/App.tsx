import './App.css';

import { Container } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccordionView from 'components/AccordionView';
import React from 'react';

import CardView from './components/cardView/CardView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      width: '100%',
      display: 'flex',
    },
  }),
);

const App = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.main}>
      <AccordionView labels={['Settings / Scatter Plot', 'Card View', 'NGL Viewer']}>
        <div>
          <Settings />
          <ScatterPlot />
        </div>
        <CardView />
        <div>NGL VIEW</div>
      </AccordionView>
    </Container>
  );
};

export default App;
