import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { addSource, selectSource, Source } from './sources';

interface IProps {
  sources: Source[];
  currentSource: Source;
  sourceLabel?: string;
}

const SourceForm = ({ sources, currentSource, sourceLabel = '' }: IProps) => {
  console.log(currentSource);

  return (
    <form
      // update defaultValue of fields when currentSource changes
      key={`${currentSource.url}-${currentSource.configName}`}
      onSubmit={(e) => {
        e.preventDefault();

        // ts doesn't know about the input elements so we need to make an assertion
        // See: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#forms-and-events

        const target = e.target as typeof e.target & {
          sourcePath: { value: string };
          maxRecords: { value: string };
        };

        addSource({
          url: target.sourcePath.value,
          maxRecords: Number(target.maxRecords.value),
          configName: null,
        });
      }}
    >
      <Autocomplete
        freeSolo
        onChange={(_, newValue) => {
          newValue !== null && selectSource(newValue);
        }}
        forcePopupIcon
        selectOnFocus
        options={Array.from(new Set(sources.map(({ url }) => url)))} // Remove duplicates
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            {...params}
            name="sourcePath"
            required
            fullWidth
            autoFocus
            helperText={sourceLabel}
            placeholder="Source"
            variant="outlined"
            color="secondary"
          />
        )}
      />
      <SourceRowTwo row>
        <TextField
          name="maxRecords"
          inputProps={{ min: 0, step: 100 }}
          type="number"
          placeholder="Max. Records"
          variant="outlined"
          size="small"
          color="secondary"
          defaultValue={currentSource.maxRecords}
        />
        <Button variant="contained" color="primary" type="submit">
          Load
        </Button>
      </SourceRowTwo>
    </form>
  );
};

export default SourceForm;

const SourceRowTwo = styled(FormGroup)`
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
