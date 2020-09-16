import React from 'react';

import './App.css';

import Keycloak, { KeycloakError, KeycloakInitOptions } from 'keycloak-js';
import styled from 'styled-components';

import { ButtonGroup, Divider as MuiDivider } from '@material-ui/core';
import { KeycloakEvent, KeycloakProvider, KeycloakTokens, useKeycloak } from '@react-keycloak/web';

import AccordionView from './components/AccordionView';
import CardView from './components/cardView/CardView';
import Loader from './components/Loader';
import { NglView } from './components/nglViewer/NGLView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import StateManagement from './components/state/StateManager';
import { KeycloakCache, useCachedKeycloak } from './hooks/useCachedKeycloak';
import { useIsStateLoaded } from './hooks/useIsStateLoaded';
import LoginButton from './LoginButton';
import PoseViewerConfig from './PoseViewerConfig';
import DataTierAPI from './services/DataTierAPI';
import Theme from './theme';

// Auth
const keycloak = Keycloak('./keycloak.json');

const serialisedCache = localStorage.getItem('keycloak-cache');
const tokens =
  serialisedCache !== null ? (JSON.parse(serialisedCache) as KeycloakCache).tokens : {};

const keycloakProviderInitConfig: KeycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  ...tokens,
};

const App = () => {
  // State to trigger rerender when tokens change
  const isLoadingFromJSON = useIsStateLoaded();
  const [keycloakCache, setKeycloakCache] = useCachedKeycloak();
  keycloakCache.tokens?.token && DataTierAPI.setToken(keycloakCache.tokens.token);

  const onKeycloakEvent = (event: KeycloakEvent, error: KeycloakError | undefined) => {
    console.log(event, error);
  };

  const onKeycloakTokens = (tokens: KeycloakTokens) => {
    console.log('onKeycloakTokens', tokens);
    DataTierAPI.setToken(tokens.token);
    setKeycloakCache({ tokens, authenticated: true });
  };

  return (
    <Theme>
      <KeycloakProvider
        keycloak={keycloak}
        initConfig={keycloakProviderInitConfig}
        onEvent={onKeycloakEvent}
        onTokens={onKeycloakTokens}
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
  const [keycloak, initialized] = useKeycloak();
  if (initialized && !keycloak.authenticated) {
    keycloak.login();
  }
  return (
    <Column>
      <ButtonGroup>
        <LoginButton />
        <PoseViewerConfig />
      </ButtonGroup>
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
