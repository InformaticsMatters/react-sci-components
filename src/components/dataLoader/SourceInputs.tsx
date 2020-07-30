import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Source } from './sources';

interface IProps {
  numOfMolsKept?: number;
  numOfMolsParsed?: number;
  sources: Source[];
  currentSource: Omit<Source, 'id'>;
  sourceLabel?: string;
  moleculesErrorMessage: string | null;
  handleLoad: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setCurrentUrl: (_: string) => void;
}

const SourceInputs = ({
  numOfMolsKept,
  numOfMolsParsed,
  sources,
  currentSource,
  sourceLabel = '',
  moleculesErrorMessage,
  handleLoad,
  setCurrentUrl,
}: IProps) => {
  const options = Array.from(new Set(sources.map(({ url }) => url))); // Remove duplicates
  return (
    <>
      <Autocomplete
        onInputChange={(_, value) => setCurrentUrl(value)}
        freeSolo
        defaultValue={currentSource.url}
        forcePopupIcon={!!options.length}
        selectOnFocus
        options={options}
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!moleculesErrorMessage}
            name="sourcePath"
            required
            fullWidth
            autoFocus
            helperText={moleculesErrorMessage || sourceLabel}
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
        {numOfMolsParsed !== undefined && (
          <Typography>
            <strong>{numOfMolsKept}</strong> loaded. <strong>{numOfMolsParsed}</strong> parsed.
          </Typography>
        )}
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
  align-items: baseline;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
