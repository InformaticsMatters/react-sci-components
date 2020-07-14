import { Button, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';

interface IProps {
  children: React.ReactNode;
  labels: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visible: {
      height: '100vh',
      visibility: 'visible',
      width: 'auto',
      minWidth: 0,
    },
    hidden: {
      height: '100vh',
      visibility: 'hidden',
      width: 0,
      minWidth: 0,
    },
  }),
);

const AccordionView = ({ children, labels }: IProps) => {
  const classes = useStyles();

  const [open, setIsOpen] = useState([true, true, true]);

  const createHandleChange = (index: number) => () => {
    const newOpen = [...open];
    newOpen.splice(index, 1, !open[index]);
    if (newOpen.some((o) => o)) {
      setIsOpen(newOpen);
    }
  };

  const grows = [0, 1, 1];
  const basis = [500, 400, undefined];

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <>
          <VerticalButton onClick={createHandleChange(index)} fullWidth>
            <Typography noWrap variant="body2">
              {labels[index]}
            </Typography>
          </VerticalButton>
          <div
            style={{
              flexGrow: open[index] ? grows[index] : 0,
              flexBasis: open[index] ? basis[index] : undefined,
            }}
            className={open[index] ? classes.visible : classes.hidden}
          >
            {child}
          </div>
        </>
      ))}
    </>
  );
};

export default AccordionView;

const VerticalButton = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    textTransform: 'none',
    position: 'sticky',
    top: 0,
    right: 0,
    boxShadow: theme.shadows[10],
    height: '100vh',
    minWidth: '3rem',
    width: 0,
    borderRadius: 0,
  },
  label: {
    transform: 'rotate(-90deg)',
    width: '80vh',
  },
}))(Button);
