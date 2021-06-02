import React, { Children, useState } from 'react';

import styled from 'styled-components';

import { CardActions, CardContent, CardProps, Card as MuiCard } from '@material-ui/core';

import DepictMolecule from './DepictMolecule';

interface IProps extends CardProps {
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

/* Generic card rendering molecule depiction with optional content and actions. */
const MolCard = ({
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
}: IProps) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Card
      {...cardProps}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent>
        <DepictMolecule
          height={depictHeight}
          mcs={depictmcs}
          noStereo={depictNoStereo}
          smiles={smiles}
          width={depictWidth}
        />
        {Children.only(children)}
      </CardContent>
      <CardActions {...actionsProps} disableSpacing>
        {actions(hover)}
      </CardActions>
    </Card>
  );
};

const Card = styled(MuiCard)`
  position: relative; /* Needed to allow actions to be position relative to this */
  cursor: ${({ onClick }) => !!onClick && 'pointer'};
`;

export default MolCard;
