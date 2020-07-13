import DraggableList from 'components/DraggableList';
import React, { useState } from 'react';

import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Configuration from '../configuration/Configuration';
import {
  moveFieldPosition,
  toggleFieldIsEnabled,
  setDepictionField,
} from './cardViewConfiguration';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: { display: 'flex', alignItems: 'center' },
    selects: { display: 'flex', flexDirection: 'column', marginBottom: theme.spacing(2) },
  }),
);

interface IProps {
  fields?: string[];
  enabledFields?: string[];
  depictionField: string;
}

const CardViewConfiguration = ({ fields = [], enabledFields = [], depictionField }: IProps) => {
  const classes = useStyles();

  const [showDisabled, setShowDisabled] = useState(true);
  // TODO: need to make reordering respect this

  const title = 'Card View';
  const depictionSelectionId = `${title}-depiction-field-selection`;

  const displayFields = fields.filter((field) => enabledFields.includes(field) || showDisabled);

  return (
    <Configuration title={title}>
      <div className={classes.header}>
        <Tooltip arrow title={'Toggle visibility of disabled fields'}>
          <Checkbox checked={showDisabled} onClick={() => setShowDisabled(!showDisabled)} />
        </Tooltip>
        <Typography variant="h6" display="inline">
          Enabled Fields
        </Typography>
      </div>
      <DraggableList
        fields={displayFields}
        checked={displayFields.map((field) => enabledFields.includes(field))}
        moveFieldPosition={moveFieldPosition}
        toggleCheckbox={toggleFieldIsEnabled}
      />
      <div className={classes.selects}>
        <Typography variant="h6" display="inline">
          Depiction Field
        </Typography>
        <FormControl>
          <InputLabel id={depictionSelectionId}>Depiction Field Selection</InputLabel>
          <Select
            labelId={depictionSelectionId}
            value={depictionField}
            onChange={({ target: { value } }) => setDepictionField(value as string)}
          >
            {fields.map((field, index) => (
              <MenuItem key={index} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Configuration>
  );
};

export default CardViewConfiguration;
