import './App.css';

import { Container } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import NGLViewer from './components/nglViewer/NGLViewer';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      overflowX: 'hidden',
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
        <NGLViewer />
      </AccordionView>
    </Container>
  );
};

export default App;
