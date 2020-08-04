import React, { useState } from 'react';

import Draggable from 'react-draggable';
import styled from 'styled-components';

import { Dialog, IconButton, Paper as MuiPaper, PaperProps } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import MultiPage from './MultiPage';
import SinglePage from './SinglePage';

interface IProps {
  titles: string | string[];
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
const Configuration = ({ width, titles, children, ModalOpenIcon, draggable = true }: IProps) => {
  const [open, setOpen] = useState(false);

  let content;

  if (typeof titles === 'string') {
    content = (
      <SinglePage title={titles} close={() => setOpen(false)}>
        {children}
      </SinglePage>
    );
  } else if (titles.length !== React.Children.count(children)) {
    throw new Error('You must pass an equal number of titles and children');
  } else {
    content = (
      <MultiPage titles={titles} close={() => setOpen(false)}>
        {children}
      </MultiPage>
    );
  }

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>{ModalOpenIcon ?? <SettingsIcon />}</IconButton>
      <Dialog
        aria-labelledby="configuration-title"
        aria-describedby="configuration-content"
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        PaperComponent={draggable ? PaperComponent : undefined}
        PaperProps={{ style: { width } }}
      >
        {content}
      </Dialog>
    </>
  );
};

export default Configuration;

const Paper = styled(MuiPaper)`
  margin: 0;
`;
