import React from 'react';

import styled from 'styled-components';

import { Button, CircularProgress } from '@material-ui/core';

import SourceCombobox from '../../components/dataLoader/SourceCombobox';
import { useSources, useWorkingSource } from '../../components/dataLoader/sources';
import { useProtein } from '../../modules/protein/protein';
import { setSettings, useSettings } from '../../modules/settings/settings';

const Settings = () => {
  const { isProteinLoading } = useProtein();
  const { proteinPath } = useSettings();
  const sources = useSources();
  const currentSource = useWorkingSource();

  return (
    <>
      <form
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
        <SourceCombobox
          key={proteinPath}
          urls={[]}
          url={proteinPath}
          placeholder="PDB url"
          label="PDB"
          name="proteinpath"
          error={null}
          size="small"
        />
        <Button type="submit" variant="contained" color="primary">
          Load PDB
          {isProteinLoading && <LoadingIndicator size={24} />}
        </Button>
      </form>
      <SourceCombobox
        // onChange
        disabled
        key={currentSource.url} // Reset defaultValue when it changes
        urls={sources.map((source) => source.url)}
        url={currentSource.url}
        placeholder="Current SDF"
        label="SDF"
        error={null}
        size="small"
      />
    </>
  );
};
export default Settings;

const LoadingIndicator = styled(CircularProgress)`
  position: 'absolute';
  color: currentColor;
`;
