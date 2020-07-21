import React, { useState } from 'react';

import styled from 'styled-components';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

interface IProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Renders a settings cog button that open a modal with a close button.
 * @param title is rendered in the model title
 * @param children are rendered in the model content
 */
const Configuration = ({ title, children }: IProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
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
