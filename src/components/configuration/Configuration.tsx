import React, { useState } from 'react';

import Draggable from 'react-draggable';
import styled from 'styled-components';

import { Button, ButtonProps, Dialog, Paper as MuiPaper, PaperProps } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const MyPaper: React.FC<PaperProps & { handle: string }> = ({ handle, ...paperProps }) => {
  return (
    <Draggable bounds={'parent'} cancel={'[class*="MuiButtonBase-root"]'} handle={`#${handle}`}>
      <Paper {...paperProps} />
    </Draggable>
  );
};

interface IProps {
  ModalOpenIcon?: React.ReactNode;
  buttonProps?: ButtonProps;
  draggable?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  width?: number | string;
  height?: number | string;
}

/**
 * Renders a settings cog button that opens a modal with a close button.
 * @param ModalOpenIcon the icon button that opens the dialog
 * @param draggable whether the component can be dragged around the screen
 * @param open use this to control the open state your self
 * @param onClose optional callback run when the close button is pressed
 * @param width the width of the paper component (number inferred as px, or string)
 * @param height the height of the paper component (number inferred as px, or string)
 *
 * @param children are rendered in the model content
 */
const Configuration: React.FC<IProps & ButtonProps> = ({
  children,
  width,
  height,
  buttonProps,
  open: propOpen,
  onOpen: propOnOpen,
  onClose: propOnClose,
  ModalOpenIcon,
  draggable = true,
}) => {
  const [stateOpen, setStateOpen] = useState(false);

  const open = propOpen ?? stateOpen;
  const handleOpen = propOnOpen ?? (() => setStateOpen(true));
  const handleClose = propOnClose ?? (() => setStateOpen(false));

  return (
    <>
      <Button
        startIcon={ModalOpenIcon ?? <SettingsIcon />}
        variant="contained"
        onClick={handleOpen}
        {...buttonProps}
      >
        Configuration
      </Button>
      <Dialog
        aria-describedby="configuration-content"
        aria-labelledby="configuration-title"
        maxWidth="lg"
        open={open}
        PaperComponent={draggable ? (MyPaper as any) : undefined}
        PaperProps={{ style: { width, height }, handle: 'configuration-title' } as any}
        onClose={handleClose}
      >
        {children}
      </Dialog>
    </>
  );
};

export default Configuration;

const Paper = styled(MuiPaper)`
  margin: 0;
`;
