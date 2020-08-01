import React from 'react';

import './App.css';

import styled from 'styled-components';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import { NglView } from './components/nglViewer/NGLView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';
import Theme from './theme';

const App = () => {
  return (
    <Theme>
      <AccordionView labels={['Settings / Scatter Plot', 'Card View', 'NGL Viewer']}>
        <Column>
          <Settings />
          <ScatterPlot />
        </Column>
        <CardView />
        <NglView div_id="ngl" height="1000px" />
      </AccordionView>
    </Theme>
  );
};

export default App;

const Column = styled.div`
  ${({ theme }) => `padding: ${theme.spacing(2)}px`}
`;
