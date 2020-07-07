import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: 300,
  },
  contentRoot: {
    padding: theme.spacing(2, 2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  deleteButton: {
    marginTop: theme.spacing(4),
  },
}));

interface IProps {
  title: string;
  children: React.ReactNode;
}

const Configuration = ({ title, children }: IProps) => {
  const classes = useStyles();

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
        <DialogTitle className={classes.root} id="modal-title">
          {title}
          <IconButton
            className={classes.closeButton}
            aria-label="close"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.contentRoot} dividers>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Configuration;
