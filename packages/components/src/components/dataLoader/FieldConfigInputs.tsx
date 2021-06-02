import React, { useState } from 'react';

import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { FieldConfig } from './workingSource';

interface IProps {
  name: string;
  type: string;
  config?: FieldConfig | null;
}

const FieldConfigInputs = ({ name, type, config }: IProps) => {
  const [isNumeric, setIsNumeric] = useState(type === 'int' || type === 'float'); // Initial value depends on the defaultValue given to select field
  const [enabled, setEnabled] = useState(
    config === null ? true : config === undefined ? false : true,
  );

  const handleDtypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === 'text') {
      setIsNumeric(false);
    } else {
      setIsNumeric(true);
    }
  };

  return (
    <>
      <Checkbox
        checked={!!enabled}
        name={`${name}-enabled`}
        onChange={() => setEnabled(!enabled)}
      />
      <Tooltip arrow title={name}>
        <Typography noWrap align="left">
          {name}
        </Typography>
      </Tooltip>
      <TextField
        color="secondary"
        defaultValue={config?.nickname}
        label="Rename Field"
        name={`${name}-nickname`}
        size="small"
        variant="outlined"
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
      <FormControl color="secondary" size="small" variant="outlined">
        <InputLabel color="secondary" id={`dtype-${name}`}>
          dtype
        </InputLabel>
        <Select
          defaultValue={config?.dtype ?? type ?? 'text'}
          label="Rank"
          labelId={`dtype-${name}`}
          name={`${name}-dtype`}
          onChange={handleDtypeChange}
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
        color="secondary"
        defaultValue={config?.min}
        disabled={!isNumeric}
        label="min"
        name={`${name}-min`}
        size="small"
        type="number"
        variant="outlined"
      />
      <TextField
        color="secondary"
        defaultValue={config?.max}
        disabled={!isNumeric}
        label="max"
        name={`${name}-max`}
        size="small"
        type="number"
        variant="outlined"
      />
    </>
  );
};

export default FieldConfigInputs;
