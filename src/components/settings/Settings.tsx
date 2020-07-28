import React from 'react';

import styled from 'styled-components';

import { Button, CircularProgress, TextField } from '@material-ui/core';

import { useProtein } from '../../modules/protein/protein';
import { setSettings } from '../../modules/settings/settings';

const Settings = () => {
  const { isProteinLoading } = useProtein();

  // console.log(isProteinLoading);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // ts doesn't know about the input elements so we need to make an assertion
        // See: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#forms-and-events

        const target = e.target as typeof e.target & {
          moleculespath: { value: string };
          proteinpath: { value: string };
        };

        setSettings({
          proteinPath: target.proteinpath.value,
        });
      }}
    >
      <TextField label="Protein" name="proteinpath" />
      <Button type="submit" variant="contained" color="primary">
        Load
        {isProteinLoading && <LoadingIndicator size={24} />}
      </Button>
    </form>
  );
};
export default Settings;

const LoadingIndicator = styled(CircularProgress)`
  position: 'absolute';
  color: currentColor;
`;
