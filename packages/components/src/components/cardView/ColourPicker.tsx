import React, { useEffect } from 'react';

import { ColorButton } from 'material-ui-color';
import styled from 'styled-components';

import { Fade, IconButton, Paper, Popper } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';

interface IProps {
  enabled: boolean;
  colours: { [tooltip: string]: string };
  iconColour?: string;
  setColour: (_: string) => void;
  clearColour?: () => void;
}

const ColourPicker = ({ enabled, colours, iconColour, setColour, clearColour }: IProps) => {
  const id = 'colour-picker';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // when this component becomes 'disabled' (e.g. parent is no longer hovered)
  // reset popper to previous state
  useEffect(() => {
    if (enabled === false) setAnchorEl(null);
  }, [enabled]);

  return (
    <>
      <IconButton aria-describedby={id} aria-label="pick-colour" onClick={handleClick}>
        <PaletteIcon htmlColor={iconColour} />
      </IconButton>
      <Popper
        transition
        anchorEl={anchorEl}
        id={id}
        open={!!anchorEl && enabled}
        style={{ zIndex: 3 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <PickerPaper>
              {Object.entries(colours).map(([tooltip, colour], index) => (
                <span
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(null);
                    setColour(colour);
                  }}
                >
                  <ColorButton color={colour} tooltip={tooltip} />
                </span>
              ))}
              {clearColour && (
                <span
                  onClick={(e) => {
                    clearColour();
                    setAnchorEl(null);
                    e.stopPropagation();
                  }}
                >
                  <ColorButton color={''} tooltip="Remove Colour" />
                </span>
              )}
            </PickerPaper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ColourPicker;

const PickerPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  grid-gap: ${({ theme }) => theme.spacing(1)}px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;
