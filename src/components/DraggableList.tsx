import React from 'react';
import { Container, Draggable, DropResult } from 'react-smooth-dnd';

import {
    Checkbox, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText
} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';

interface IProps {
  fields: string[];
  checked: boolean[];
  moveFieldPosition: (event: DropResult) => void;
  showCheckboxes?: boolean;
  toggleCheckbox?: (field: string) => void;
}

const DraggableList = ({
  fields,
  checked,
  moveFieldPosition,
  showCheckboxes = true,
  toggleCheckbox = () => {},
}: IProps) => {
  return (
    <List>
      <Container
        dragHandleSelector=".drag-handle"
        lockAxis="y"
        onDrop={(event) => moveFieldPosition(event)}
      >
        {fields.map((field, index) => (
          <Draggable key={index}>
            <ListItem dense button onClick={() => toggleCheckbox(field)}>
              {showCheckboxes && (
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked[index]}
                    // tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
              )}
              <ListItemText primary={field} />
              <ListItemSecondaryAction>
                <ListItemIcon className="drag-handle">
                  <DragHandleIcon />
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          </Draggable>
        ))}
      </Container>
    </List>
  );
};

export default DraggableList;
