import { Button, CircularProgress, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

import { useMolecules } from '../../modules/molecules/molecules';
import { setMoleculesPath } from '../../modules/settings/settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchIndicator: {
      position: 'absolute',
    },
  }),
);

const Settings = () => {
  const { isMoleculesLoading } = useMolecules();

  console.log(isMoleculesLoading);


  const classes = useStyles();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // ts doesn't know about the input elements so we need to make an assertion
        // See: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#forms-and-events

        const target = e.target as typeof e.target & {
          moleculespath: { value: string };
        };

        setMoleculesPath(target.moleculespath.value);
      }}
    >
      <TextField label="Molecules" name="moleculespath" />
      <Button type="submit" variant="contained" color="primary">
        Load
        {isMoleculesLoading && <CircularProgress size={24} className={classes.searchIndicator} />}
      </Button>
    </form>
  );
};
export default Settings;
