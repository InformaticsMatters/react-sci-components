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
  setDepictionField,
  toggleFieldIsEnabled,
} from './cardViewConfiguration';

import type { DropResult } from 'react-smooth-dnd';

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
  const title = 'Card View';
  const depictionSelectionId = `${title}-depiction-field-selection`;

  const classes = useStyles();

  const [showHidden, setShowHidden] = useState(true);
  // TODO: need to make reordering respect this

  const displayFields = fields.filter((field) => enabledFields.includes(field) || showHidden);

  const handleMoveFieldPosition = ({ removedIndex, addedIndex }: DropResult) => {
    // Need to handle indexes different if fields are hidden
    if (showHidden) {
      moveFieldPosition({ removedIndex, addedIndex });
    } else if (removedIndex !== null && addedIndex !== null) {
      const removedField = displayFields[removedIndex];
      const addedField = displayFields[addedIndex];

      const fixedRemovedIndex = fields.indexOf(removedField);
      const fixedAddedIndex = fields.indexOf(addedField);

      moveFieldPosition({ removedIndex: fixedRemovedIndex, addedIndex: fixedAddedIndex });
    }
  };

  return (
    <Configuration title={title}>
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
      <div className={classes.header}>
        <Tooltip arrow title={'Toggle visibility of disabled fields'}>
          <Checkbox checked={showHidden} onClick={() => setShowHidden(!showHidden)} />
        </Tooltip>
        <Typography variant="h6" display="inline">
          Toggle Hidden Fields
        </Typography>
      </div>
      <DraggableList
        fields={displayFields}
        checked={displayFields.map((field) => enabledFields.includes(field))}
        moveFieldPosition={handleMoveFieldPosition}
        toggleCheckbox={toggleFieldIsEnabled}
      />
    </Configuration>
  );
};

export default CardViewConfiguration;
