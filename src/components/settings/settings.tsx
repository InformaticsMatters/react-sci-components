import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React from 'react';

import { setMoleculesPath, useSettings } from '../../modules/settings/settings';

export const Settings = () => {
    const settings = useSettings();

    return (
        <form onSubmit={e => {
            e.preventDefault();
            setMoleculesPath(e.target.moleculespath.value);
        }}>
            <TextField label='Molecules' name="moleculespath"/>
            <Button type="submit" variant="contained" color="primary">
                Load
            </Button>
        </form>
    );
};
