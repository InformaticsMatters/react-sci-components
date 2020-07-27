import React from 'react';

import styled from 'styled-components';

import { Button, FormGroup, TextField, TextFieldProps, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { selectConfig, Source } from './sources';

interface IProps {
  sources: Source[];
  currentSource: Source;
  fieldNames: string[];
}

type ConfigOption = { id: number; configName: string };

const FieldConfigForm = ({ sources, currentSource, fieldNames }: IProps) => {
  const configOptions: ConfigOption[] = sources
    .filter((source) => source.url === currentSource.url)
    .map(({ id, configName }) => ({ id, configName }));

  return (
    <form>
      {fieldNames.map((name, index) => (
        <FieldRow row key={index}>
          <Typography>{name}</Typography>
          <NumericField
            width="8rem"
            size="small"
            variant="outlined"
            color="secondary"
            label="Rename Field"
          />
          {/* <FormControl size="small" variant="outlined">
            <InputLabel color="secondary" id={`rank-${index}`}>
              Rank
            </InputLabel>
            <Select color="secondary" labelId={`rank-${index}`} defaultValue="asc" label="Rank">
              <MenuItem value="asc">ASC</MenuItem>
              <MenuItem value="desc">DESC</MenuItem>
            </Select>
          </FormControl>
          <FormControl disabled size="small" variant="outlined" color="secondary">
            <InputLabel color="secondary" id={`rank-${index}`}>
              dtype
            </InputLabel>
            <Select labelId={`rank-${index}`} defaultValue="float" label="Rank">
              <MenuItem value="float">float</MenuItem>
              <MenuItem value="int">int</MenuItem>
              <MenuItem value="text">text</MenuItem>
            </Select>
          </FormControl>
          <FormControl disabled size="small" variant="outlined">
            <InputLabel id={`rank-${index}`}>Transform</InputLabel>
            <Select color="secondary" labelId={`rank-${index}`} defaultValue="log10" label="Rank">
              <MenuItem value="log10">log10</MenuItem>
            </Select>
          </FormControl>
          <NumericField color="secondary" label="Default" />
          <NumericField color="secondary" label="min" type="number" />
          <NumericField color="secondary" label="max" type="number" /> */}
        </FieldRow>
      ))}
      <ConfigSaveFormGroup row>
        <Autocomplete
          style={{ width: '15rem' }}
          onChange={(_, newValue) => {
            newValue !== null && selectConfig(newValue.id);
          }}
          color="secondary"
          options={configOptions}
          getOptionLabel={(option) => option.configName} // ?
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              variant="outlined"
              color="secondary"
              placeholder="Config Name"
            />
          )}
        />
        <Button type="submit" variant="outlined" color="primary">
          Save
        </Button>
      </ConfigSaveFormGroup>
    </form>
  );
};

export default FieldConfigForm;

const NumberInput = (props: TextFieldProps) => (
  <TextField {...props} size="small" variant="outlined" />
);

interface NumericFieldExtraProps {
  width?: number | string;
}

const NumericField = styled(NumberInput)<NumericFieldExtraProps>`
  width: ${({ width = '5rem' }) => width};
`;

const FieldRow = styled(FormGroup)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  align-items: center;
  flex-wrap: nowrap;
  > div,
  p {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }
`;

const ConfigSaveFormGroup = styled(FormGroup)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  > div:first-child {
    margin-right: ${({ theme }) => theme.spacing(2)}px;
  }
`;

// const ConfigComboBox = styled(Autocomplete)`
//   width: 15rem;
// `;
