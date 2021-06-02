import React from 'react';

import { Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

interface IProps {
  open: boolean;
  reason: string;
}

const Loader: React.FC<IProps> = ({ open, reason }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <div>
        <Typography gutterBottom variant="h6">
          {reason}
        </Typography>
        <CircularProgress color="inherit" />
      </div>
    </Backdrop>
  );
};

export default Loader;
