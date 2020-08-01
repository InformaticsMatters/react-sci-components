import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField, Typography } from '@material-ui/core';

import SourceCombobox from './SourceCombobox';
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
  return (
    <>
      <SourceCombobox
        urls={sources.map((source) => source.url)}
        url={currentSource.url}
        name="sourcePath"
        placeholder={'Source'}
        required
        label={sourceLabel}
        error={moleculesErrorMessage}
        setValue={setCurrentUrl}
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
