import React, { useState } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

import { FieldConfig } from './sources';

interface IProps {
  name: string;
  config?: FieldConfig;
}

const FieldConfigInputs = ({ name, config }: IProps) => {
  const [isNumeric, setIsNumeric] = useState(config?.dtype === 'int' || config?.dtype === 'float'); // Initial value depends on the defaultValue given to select field

  const handleDtypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === 'text') {
      setIsNumeric(false);
    } else {
      setIsNumeric(true);
    }
  };

  return (
    <>
      <Typography noWrap>{name}</Typography>
      <TextField
        name={`${name}-nickname`}
        size="small"
        variant="outlined"
        color="secondary"
        label="Rename Field"
        defaultValue={config?.nickname}
      />
      {/* <FormControl size="small" variant="outlined">
      <InputLabel color="secondary" id={`rank-${name}`}>
        Rank
      </InputLabel>
      <Select color="secondary" labelId={`rank-${name}`} defaultValue="asc" label="Rank">
        <MenuItem value="asc">ASC</MenuItem>
        <MenuItem value="desc">DESC</MenuItem>
      </Select>
    </FormControl> */}
      <FormControl size="small" variant="outlined" color="secondary">
        <InputLabel color="secondary" id={`dtype-${name}`}>
          dtype
        </InputLabel>
        <Select
          onChange={handleDtypeChange}
          name={`${name}-dtype`}
          labelId={`dtype-${name}`}
          defaultValue={config?.dtype ?? 'text'}
          label="Rank"
        >
          <MenuItem value="float">float</MenuItem>
          <MenuItem value="int">int</MenuItem>
          <MenuItem value="text">text</MenuItem>
        </Select>
      </FormControl>
      {/* <FormControl disabled size="small" variant="outlined">
      <InputLabel id={`rank-${name}`}>Transform</InputLabel>
      <Select color="secondary" labelId={`rank-${name}`} defaultValue="log10" label="Rank">
        <MenuItem value="log10">log10</MenuItem>
      </Select>
    </FormControl> */}
      {/* <NumericField color="secondary" label="Default" /> */}
      <TextField
        disabled={!isNumeric}
        name={`${name}-min`}
        size="small"
        variant="outlined"
        color="secondary"
        label="min"
        type="number"
        defaultValue={config?.min}
      />
      <TextField
        disabled={!isNumeric}
        name={`${name}-max`}
        size="small"
        variant="outlined"
        color="secondary"
        label="max"
        type="number"
        defaultValue={config?.max}
      />
    </>
  );
};

export default FieldConfigInputs;
