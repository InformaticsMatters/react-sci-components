import { useEffect } from 'react';

import { useStorageState } from 'react-storage-hooks';

import { KeycloakTokens, useKeycloak } from '@react-keycloak/web';

export type KeycloakCache = {
  authenticated: boolean | undefined;
  tokens: Partial<KeycloakTokens>;
};

export const useCachedKeycloak = () => {
  const { keycloak, initialized } = useKeycloak();
  const [cachedKeycloak, setCachedKeycloak] = useStorageState<KeycloakCache>(
    localStorage,
    'keycloak-cache',
  );

  const authenticated = keycloak?.authenticated;
  const token = keycloak?.token;

  useEffect(() => {
    if (initialized) {
      const tokens = {
        token: token,
        idToken: undefined,
        refreshToken: undefined,
      };
      setCachedKeycloak({ authenticated, tokens });
    }
  }, [initialized, authenticated, token, setCachedKeycloak]);

  return [
    cachedKeycloak || {
      authenticated: false,
      tokens: {},
    },
    setCachedKeycloak,
  ] as const;
};
