import React from 'react';

import { FieldMeta } from 'modules/molecules/molecules';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import { setConfigurationItem, useScatterplotConfiguration } from './plotConfiguration';

interface IProps {
  title: string;
  fields: FieldMeta[];
}

const ScatterplotConfig = ({ title, fields }: IProps) => {
  const config = useScatterplotConfiguration();

  return (
    <>
      <h3>Displayed Scores</h3>
      <SelectsWrapper>
        {fields.length ? (
          Object.entries(config).map(([name, value], i) => {
            return (
              <FormControl key={i}>
                <InputLabel id={`${title}-${name}`}>{name}</InputLabel>
                <Select
                  labelId={`${title}-${name}`}
                  value={value ?? ''}
                  onChange={({ target: { value } }) =>
                    setConfigurationItem({ name, value: value as string })
                  }
                >
                  <MenuItem value={'id'}>id</MenuItem>
                  {fields.map(({ name, nickname, dtype }, j) => (
                    <MenuItem key={j} value={name}>
                      {`${nickname} (${dtype})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })
        ) : (
          <p>Please load some molecules to set the axis props</p>
        )}
      </SelectsWrapper>
    </>
  );
};

export default ScatterplotConfig;

const SelectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
