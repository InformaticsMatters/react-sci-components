import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { setWorkingSource, Source } from './sources';

interface IProps {
  sources: Source[];
  currentSource: Omit<Source, 'id'>;
  handleSave: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

type ConfigOption = { id: number; configName: string };

const ConfigManager = ({ sources, currentSource, handleSave }: IProps) => {
  const configOptions: ConfigOption[] = sources
    .filter((source) => source.url === currentSource.url)
    .map(({ id, configName }) => ({ id, configName }));

  return (
    <ConfigSaveFormGroup row>
      <Autocomplete
        freeSolo
        forcePopupIcon={!!configOptions.length}
        selectOnFocus
        defaultValue={{ id: -1, configName: currentSource.configName }}
        onChange={(_, newValue) => {
          if (typeof newValue !== 'string' && newValue !== null) {
            const newSource = sources.find((source) => source.id === newValue.id);
            !!newSource && setWorkingSource(newSource);
          }
        }}
        style={{ width: '15rem' }}
        color="secondary"
        options={configOptions}
        filterOptions={(options) => options}
        getOptionLabel={(option) => option.configName}
        renderInput={(params) => (
          <TextField
            {...params}
            name="configName"
            size="small"
            variant="outlined"
            color="secondary"
            placeholder="Config Name"
          />
        )}
      />
      <Button
        disabled={!currentSource.url.length}
        variant="outlined"
        color="primary"
        onClick={handleSave}
      >
        Save
      </Button>
    </ConfigSaveFormGroup>
  );
};

export default ConfigManager;

const ConfigSaveFormGroup = styled(FormGroup)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  > div:first-child {
    margin-right: ${({ theme }) => theme.spacing(2)}px;
  }
`;
