import React, { useState } from 'react';

import Draggable from 'react-draggable';
import styled from 'styled-components';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper as MuiPaper,
  PaperProps,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

interface IProps {
  title: string;
  children: React.ReactNode;
  ModalOpenIcon?: React.ReactNode;
  draggable?: boolean;
  width?: number | string;
}

const PaperComponent = (props: PaperProps) => {
  return (
    <Draggable bounds={'parent'} handle="#modal-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

/**
 * Renders a settings cog button that open a modal with a close button.
 * @param title is rendered in the model title
 * @param children are rendered in the model content
 */
const Configuration = ({ width, title, children, ModalOpenIcon, draggable = true }: IProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>{ModalOpenIcon ?? <SettingsIcon />}</IconButton>
      <Dialog
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        PaperComponent={draggable ? PaperComponent : undefined}
        PaperProps={{ style: { width } }}
      >
        <Title id="modal-title">
          {title}
          <CloseButton aria-label="close" onClick={() => setOpen(false)}>
            <CloseIcon />
          </CloseButton>
        </Title>
        <Content dividers>{children}</Content>
      </Dialog>
    </>
  );
};

export default Configuration;

const Paper = styled(MuiPaper)`
  margin: 0;
`;

const Title = styled(DialogTitle)`
  margin: 0;
  padding: ${({ theme }) => theme.spacing(2)}px;
  min-width: 300;
`;

const Content = styled(DialogContent)`
  padding: ${({ theme }) => theme.spacing(2, 2)};
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }) => theme.spacing(1)}px;
  top: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.grey[500]};
`;
