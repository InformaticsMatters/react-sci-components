import { CardActions, CardContent } from '@material-ui/core';
import Card, { CardProps } from '@material-ui/core/Card';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { Children, useState } from 'react';

import DepictMolecule from './DepictMolecule';

interface Props extends CardProps {
  smiles: string;
  children?: React.ReactNode;
  depictNoStereo?: boolean;
  depictWidth?: number;
  depictHeight?: number;
  depictmcs?: string;
  bgColor?: string;
  actions?: (hover?: boolean) => React.ReactNode;
  actionsProps?: {
    className: string;
  };
  onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'relative',
      backgroundColor: ({ bgColor }: Props) => bgColor,
      cursor: ({ onClick }: Props) => onClick && 'pointer',
    },
  }),
);

const MolCard = (props: Props) => {
  /* Generic card rendering molecule depiction with optional content and actions. */
  const {
    children,
    smiles,
    depictNoStereo = false,
    depictWidth,
    depictHeight,
    depictmcs,
    bgColor,
    actions = () => undefined,
    actionsProps,
    onClick,
    ...cardProps
  } = props;

  const classes = useStyles(props);

  const [hover, setHover] = useState<boolean>(false);

  return (
    <Card
      {...cardProps}
      className={classes.paper}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <CardContent>
        <DepictMolecule
          noStereo={depictNoStereo}
          smiles={smiles}
          width={depictWidth}
          height={depictHeight}
          mcs={depictmcs}
        />
        {Children.only(children)}
      </CardContent>
      <CardActions {...actionsProps} disableSpacing>
        {actions(hover)}
      </CardActions>
    </Card>
  );
};

export default MolCard;
