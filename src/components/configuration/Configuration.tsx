import React, { useState } from 'react';

import Draggable from 'react-draggable';
import styled from 'styled-components';

import { Button, Dialog, Paper as MuiPaper, PaperProps } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import MultiPage from './MultiPage';
import SinglePage from './SinglePage';

const createPaperComponent = (id: string) => (props: PaperProps) => {
  return (
    <Draggable bounds={'parent'} handle={`#${id}`} cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

interface IProps {
  titles: string | string[];
  ModalOpenIcon?: React.ReactNode;
  draggable?: boolean;
  width?: number | string;
  height?: number | string;
}

/**
 * Renders a settings cog button that open a modal with a close button.
 * @param titles
 * * if string: the text rendered in the title of the dialog
 * * if string[]: each item is rendered in a tab
 * @param ModalOpenIcon the icon button that opens the dialog
 * @param draggable whether the component can be dragged around the screen
 * @param draggable whether the component can be dragged around the screen
 * @param width the width of the paper component (number inferred as px, or string)
 * @param height the height of the paper component (number inferred as px, or string)
 *
 * @param children are rendered in the model content
 */
const Configuration: React.FC<IProps> = ({
  width,
  height,
  titles,
  children,
  ModalOpenIcon,
  draggable = true,
}) => {
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
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
        startIcon={ModalOpenIcon ?? <SettingsIcon />}
      >
        Configuration
      </Button>
      <Dialog
        aria-labelledby="configuration-title"
        aria-describedby="configuration-content"
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        PaperComponent={draggable ? createPaperComponent('configuration-title') : undefined}
        PaperProps={{ style: { width, height } }}
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
