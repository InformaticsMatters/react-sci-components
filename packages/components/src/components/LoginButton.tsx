import React from 'react';

import styled from 'styled-components';

import { Button, ButtonProps, CircularProgress } from '@material-ui/core';
import { useKeycloak } from '@react-keycloak/web';
import { DataTierAPI } from '@squonk/data-tier-services';

import { useCachedKeycloak } from '../hooks/useCachedKeycloak';

const LoginButton: React.FC<ButtonProps> = (buttonProps) => {
  const { keycloak, initialized } = useKeycloak();
  const isAuthenticated = !!keycloak?.authenticated;
  const [, setCachedKeycloak] = useCachedKeycloak();

  const authLogin = () => {
    keycloak?.login();
  };
  const authLogout = () => {
    DataTierAPI.removeToken();
    setCachedKeycloak(null);
    keycloak?.logout();
  };

  return (
    <Button
      disabled={!initialized}
      variant="outlined"
      color="default"
      onClick={!isAuthenticated ? authLogin : authLogout}
      {...buttonProps}
    >
      {!!isAuthenticated ? 'logout' : 'login'}
      {!initialized && <Progress size={24} />}
    </Button>
  );
};

export default LoginButton;

// TODO: Make reusable @ref DataLoader.tsx
const Progress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;
