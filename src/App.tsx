import React, { useState } from 'react';

import './App.css';

import Keycloak, { KeycloakError, KeycloakInitOptions } from 'keycloak-js';
import styled from 'styled-components';

import { Divider as MuiDivider } from '@material-ui/core';
import { KeycloakEvent, KeycloakProvider, KeycloakTokens } from '@react-keycloak/web';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import Loader from './components/Loader';
import { NglView } from './components/nglViewer/NGLView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import StateManagement from './components/state/StateManager';
import { useIsStateLoaded } from './hooks/useIsStateLoaded';
import PoseViewerConfig from './PoseViewerConfig';
import DataTierAPI from './services/DataTierAPI';
import Theme from './theme';

// Auth
const keycloak = Keycloak('./keycloak.json'); // TODO: make the subpath programmatic

const keycloakProviderInitConfig: KeycloakInitOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false, // Without this reload of browser will prevent auto login
};

const App = () => {
  // State to trigger rerender when tokens change
  const [, setToken] = useState<KeycloakTokens | null>(null);
  const isLoadingFromJSON = useIsStateLoaded();

  const onKeycloakEvent = (event: KeycloakEvent, error: KeycloakError | undefined) => {
    // console.log('onKeycloakEvent', event, error);
  };

  const onKeycloakTokens = (tokens: KeycloakTokens) => {
    // console.log('onKeycloakTokens', tokens);
    DataTierAPI.setToken(tokens.token);
    setToken(tokens);
  };

  return (
    <Theme>
      <KeycloakProvider
        keycloak={keycloak}
        initConfig={keycloakProviderInitConfig}
        onEvent={onKeycloakEvent}
        onTokens={onKeycloakTokens}
        isLoadingCheck={(keycloak) => !!keycloak.authenticated && !DataTierAPI.getToken()}
        LoadingComponent={<Loader open reason={'Authenticating...'} />}
      >
        <>
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
        </>
      </KeycloakProvider>
    </Theme>
  );
};

export default App;

const FirstPanel = ({ width }: { width: number }) => {
  // Need to ensure a token exists before rendering the pose viewer otherwise it will cause a 401
  return (
    <Column>
      {DataTierAPI.hasToken() && <PoseViewerConfig />}
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
