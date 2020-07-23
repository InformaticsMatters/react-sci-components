import React from 'react';

import './App.css';

import styled, { ThemeProvider } from 'styled-components';

import { Container as MuiContainer, ContainerProps } from '@material-ui/core';
import { StylesProvider, useTheme } from '@material-ui/core/styles';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import {NglView} from './components/nglViewer/NGLView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';

const App = () => {
  const theme = useTheme();

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </StylesProvider>
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
