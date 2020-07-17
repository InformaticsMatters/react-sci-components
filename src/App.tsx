import './App.css';

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Container } from '@material-ui/core';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';

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
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
