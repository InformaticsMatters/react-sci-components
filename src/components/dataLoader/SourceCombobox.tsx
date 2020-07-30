import React from 'react';

import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface IProps {
  urls: string[];
  url: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error: string | null;
  label: string;
  setValue?: (_: string) => void;
  size?: 'small' | 'medium';
  // onChange:
}

const SourceCombobox = ({
  urls,
  setValue,
  url,
  name,
  placeholder,
  required,
  disabled,
  error,
  label,
  size,
}: IProps) => {
  const options = Array.from(new Set(urls)); // Remove duplicates
  return (
    <Autocomplete
      onInputChange={(_, value) => setValue && setValue(value)}
      freeSolo
      defaultValue={url}
      forcePopupIcon={!!options.length}
      selectOnFocus
      options={options}
      filterOptions={(options) => options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          name={name}
          required={required}
          disabled={disabled}
          fullWidth
          autoFocus
          helperText={error || label}
          placeholder={placeholder}
          variant="outlined"
          color="secondary"
          size={size}
        />
      )}
    />
  );
};

export default SourceCombobox;
