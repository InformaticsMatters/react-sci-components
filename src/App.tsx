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
        {(width) => {
          return [
            <FirstPanel width={width} />,
            <CardView width={width} />,
            <NglView width={width} div_id="ngl" height="1000px" />,
          ];
        }}
      </AccordionView>
    </Theme>
  );
};

export default App;

const FirstPanel = ({ width }: { width: number }) => {
  return (
    <Column>
      <Settings />
      <ScatterPlot width={width} />
    </Column>
  );
};

const Column = styled.div`
  ${({ theme }) => `padding: ${theme.spacing(2)}px`}
`;
