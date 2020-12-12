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
        name={`${name}-enabled`}
        checked={!!enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <Tooltip title={name} arrow>
        <Typography align="left" noWrap>
          {name}
        </Typography>
      </Tooltip>
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
          defaultValue={config?.dtype ?? type ?? 'text'}
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
