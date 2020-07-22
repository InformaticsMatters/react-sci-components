import React from 'react';

import styled from 'styled-components';

import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Source } from './loadedData';

interface IProps {
  sources: Source[];
}

const DataLoader = () => {
  const fields = ['Field 1', 'Field 2', 'Field 3', 'Field 4'];
  return (
    <>
      <form>
        <Autocomplete
          options={['source1', 'source2']}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              autoFocus
              helperText="Paste a url to a .sdf or .sdf.gz file"
              placeholder="Source"
              variant="outlined"
            />
          )}
        />
        <SourceRowTwo row>
          <TextField
            inputProps={{ min: 0, step: 100 }}
            type="number"
            placeholder="Max. Records"
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="primary">
            Load
          </Button>
        </SourceRowTwo>
      </form>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand field configuration"
          aria-controls="field-confi-content"
          id="field-config-header"
        >
          <Typography>Field Configuration</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <form>
            {fields.map((f, index) => (
              <FieldRow row key={index}>
                <Typography>{f}</Typography>
                <NumericField width="8rem" size="small" variant="outlined" label="Rename Field" />
                <FormControl size="small" variant="outlined">
                  <InputLabel id={`rank-${index}`}>Rank</InputLabel>
                  <Select labelId={`rank-${index}`} defaultValue="asc" label="Rank">
                    <MenuItem value="asc">ASC</MenuItem>
                    <MenuItem value="desc">DESC</MenuItem>
                  </Select>
                </FormControl>
                <FormControl disabled size="small" variant="outlined">
                  <InputLabel id={`rank-${index}`}>dtype</InputLabel>
                  <Select labelId={`rank-${index}`} defaultValue="float" label="Rank">
                    <MenuItem value="float">float</MenuItem>
                    <MenuItem value="int">int</MenuItem>
                    <MenuItem value="text">text</MenuItem>
                  </Select>
                </FormControl>
                <FormControl disabled size="small" variant="outlined">
                  <InputLabel id={`rank-${index}`}>Transform</InputLabel>
                  <Select labelId={`rank-${index}`} defaultValue="log10" label="Rank">
                    <MenuItem value="log10">log10</MenuItem>
                  </Select>
                </FormControl>
                <NumericField label="Default" />
                <NumericField label="min" type="number" />
                <NumericField label="max" type="number" />
              </FieldRow>
            ))}
            <ConfigSaveFormGroup row>
              <ConfigComboBox
                options={['config1', 'config2']}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    variant="outlined"
                    placeholder="Config Name"
                  />
                )}
              />
              <Button variant="outlined" color="primary">
                Save
              </Button>
            </ConfigSaveFormGroup>
          </form>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};

const NumberInput = (props: TextFieldProps) => (
  <TextField {...props} size="small" variant="outlined" />
);

interface NumericFieldExtraProps {
  width?: number | string;
}

const NumericField = styled(NumberInput)<NumericFieldExtraProps>`
  width: ${({ width = '5rem' }) => width};
`;

const SourceRowTwo = styled(FormGroup)`
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
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

const ConfigComboBox = styled(Autocomplete)`
  width: 15rem;
`;

export default DataLoader;
