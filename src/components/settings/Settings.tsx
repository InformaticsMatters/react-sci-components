import React from 'react';

import styled from 'styled-components';

import { Button, CircularProgress } from '@material-ui/core';

import SourceCombobox from '../../components/dataLoader/SourceCombobox';
import { useProtein } from '../../modules/protein/protein';
import { setSettings, useSettings } from '../../modules/settings/settings';

/**
 * Form for specifying the pdb url
 */
const Settings = () => {
  const { isProteinLoading } = useProtein();

  const { proteinPath } = useSettings();

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();

          // ts doesn't know about the input elements so we need to make an assertion
          // See: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#forms-and-events

          const target = e.target as typeof e.target & {
            proteinpath: { value: string };
          };

          setSettings({
            proteinPath: target.proteinpath.value,
          });
        }}
      >
        <PdbWrapper>
          <SourceCombobox
            key={proteinPath}
            urls={[]}
            url={proteinPath}
            placeholder="Current PDB"
            label="PDB"
            name="proteinpath"
            error={null}
            size="small"
            fullWidth
          />
        </PdbWrapper>
        <Button type="submit" variant="contained" color="primary">
          Load PDB
          {isProteinLoading && <LoadingIndicator size={24} />}
        </Button>
      </Form>
    </>
  );
};
export default Settings;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const PdbWrapper = styled.div`
  width: calc(100% - ${({ theme }) => 101 + theme.spacing(2)}px);
`;

const LoadingIndicator = styled(CircularProgress)`
  position: 'absolute';
  color: currentColor;
`;
