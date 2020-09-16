import React from 'react';

import { Container, Draggable, DropResult } from 'react-smooth-dnd';

import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';

interface IProps {
  fields: { name: string; title: string }[];
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
        {fields.map(({name, title}, index) => (
          <Draggable key={index}>
            <ListItem dense button onClick={() => toggleCheckbox(name)}>
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
              <ListItemText primary={title} />
              <ListItemSecondaryAction>
                <DragHandleIcon className="drag-handle" />
              </ListItemSecondaryAction>
            </ListItem>
          </Draggable>
        ))}
      </Container>
    </List>
  );
};

export default DraggableList;
