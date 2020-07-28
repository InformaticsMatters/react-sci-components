import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Source } from './sources';

interface IProps {
  sources: Source[];
  currentSource: Omit<Source, 'id'>;
  sourceLabel?: string;
  handleLoad: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SourceInputs = ({ sources, currentSource, sourceLabel = '', handleLoad }: IProps) => {
  const options = Array.from(new Set(sources.map(({ url }) => url))); // Remove duplicates
  return (
    <>
      <Autocomplete
        freeSolo
        defaultValue={currentSource.url}
        forcePopupIcon={!!options.length}
        selectOnFocus
        options={options}
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
        <Button variant="contained" color="primary" onClick={handleLoad}>
          Load
        </Button>
      </SourceRowTwo>
    </>
  );
};

export default SourceInputs;

const SourceRowTwo = styled(FormGroup)`
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
