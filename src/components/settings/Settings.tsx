import React from 'react';

import styled from 'styled-components';

import { Button, CircularProgress, TextField } from '@material-ui/core';

import { useMolecules } from '../../modules/molecules/molecules';
import { setMoleculesPath } from '../../modules/settings/settings';

const Settings = () => {
  const { isMoleculesLoading } = useMolecules();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // ts doesn't know about the input elements so we need to make an assertion
        // See: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#forms-and-events

        const target = e.target as typeof e.target & {
          moleculespath: { value: string };
        };

        setMoleculesPath(target.moleculespath.value);
      }}
    >
      <SDFField label="Molecules" name="moleculespath" />
      <Button type="submit" variant="contained" color="primary">
        Load
        {isMoleculesLoading && <LoadingIndicator size={24} />}
      </Button>
    </form>
  );
};
export default Settings;

const LoadingIndicator = styled(CircularProgress)`
  position: 'absolute';
  color: currentColor;
`;

const SDFField = styled(TextField)`
  width: 100%;
`;
