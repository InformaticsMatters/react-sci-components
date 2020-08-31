import React from 'react';

import './App.css';

import styled from 'styled-components';

import { Divider as MuiDivider } from '@material-ui/core';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import Loader from './components/Loader';
import { NglView } from './components/nglViewer/NGLView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import StateManagement from './components/state/StateManager';
import { useIsStateLoaded } from './hooks/useIsStateLoaded';
import PoseViewerConfig from './PoseViewerConfig';
import Theme from './theme';

const App = () => {
  const isLoadingFromJSON = useIsStateLoaded();

  return (
    <Theme>
      <Loader open={isLoadingFromJSON} reason="Loading..." />
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
      <PoseViewerConfig />
      <StateManagement />
      <Divider />
      <ScatterPlot width={width} />
    </Column>
  );
};

const Column = styled.div`
  ${({ theme }) => `padding: ${theme.spacing(2)}px`}
`;

const Divider = styled(MuiDivider)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
