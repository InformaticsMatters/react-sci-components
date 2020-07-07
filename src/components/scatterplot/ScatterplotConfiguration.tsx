import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import Configuration from '../configuration/Configuration';
import { setConfigurationItem, useScatterplotConfiguration } from './plotConfiguration';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ selects: { display: 'flex', flexDirection: 'column' } }),
);
interface IProps {
  properties: string[];
}

const ScatterplotConfiguration = ({ properties }: IProps) => {
  const classes = useStyles();

  const config = useScatterplotConfiguration();

  const title = 'Scatterplot';

  return (
    <Configuration title={title}>
      <h3>Displayed Scores</h3>
      <div className={classes.selects}>
        {properties.length ? (
          Object.entries(config).map(([name, value], i) => {
            // console.log(name, value);

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
                  {properties.map((prop, j) => (
                    <MenuItem key={j} value={prop}>
                      {prop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })
        ) : (
          <p>Please load some molecules to set the axis props</p>
        )}
      </div>
    </Configuration>
  );
};

export default ScatterplotConfiguration;
