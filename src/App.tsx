import React from 'react';

import './App.css';

import styled from 'styled-components';

import { Container as MuiContainer, ContainerProps } from '@material-ui/core';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import DataLoader from './components/dataLoader/DataLoader';
import { NglView } from './components/nglViewer/NGLView';
import NGLViewer from './components/nglViewer/NGLViewer';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';
import Theme from './theme';

const App = () => {
  return (
    <Theme>
      <Container>
        <AccordionView labels={['Settings / Scatter Plot', 'Card View', 'NGL Viewer']}>
          <Column>
            <Settings />
            <ScatterPlot />
          </Column>
          <CardView />
          <NglView div_id='ngl' height='1000px'/>
        </AccordionView>
      </Container>
    </Theme>
  );
};

export default App;

const Container = styled(({ children, ...props }: ContainerProps) => (
  <MuiContainer maxWidth="xl" {...props}>
    {children}
  </MuiContainer>
))`
  display: flex;
  overflow-x: hidden;
`;

const Column = styled.div`
  ${({ theme }) => `padding: ${theme.spacing(2)}px`}
`;
