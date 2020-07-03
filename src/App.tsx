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
    first: {
      padding: theme.spacing(2),
    },
  }),
);

const App = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="xl" className={classes.main}>
      <AccordionView labels={['Settings / Scatter Plot', 'Card View', 'NGL Viewer']}>
        <div className={classes.first}>
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
