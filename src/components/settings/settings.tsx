import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';

import { setMoleculesPath } from '../../modules/settings/settings';

const Settings = () => {
  //   const settings = useSettings();

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
      </Button>
    </form>
  );
};
export default Settings;
