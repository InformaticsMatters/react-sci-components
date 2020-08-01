import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Button, Container as MuiContainer, ContainerProps, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useComponentSize from '@rehooks/component-size';

interface IProps {
  children: React.ReactNode;
  labels: string[];
}

const AccordionView = ({ children, labels }: IProps) => {
  // Container size
  const ref = useRef(null);
  const { width } = useComponentSize<HTMLDivElement>(ref);
  useEffect(() => console.debug(width), [width]);

  // Open panels
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

  // NGL Resize

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  });

  // Need to find ref to
  return (
    <div ref={ref}>
      <Container>
        <>
          {React.Children.map(children, (child, index) => (
            <>
              <VerticalButton onClick={createHandleChange(index)} fullWidth>
                <Typography noWrap variant="body2">
                  {labels[index]}
                </Typography>
              </VerticalButton>
              <AccordionColumn
                visible={open[index]}
                grow={open[index] ? grows[index] : 0}
                basis={open[index] ? basis[index] : undefined}
              >
                {child}
              </AccordionColumn>
            </>
          ))}
        </>
      </Container>
    </div>
  );
};

export default AccordionView;

const Container = styled(({ children, ...props }: ContainerProps) => (
  <MuiContainer maxWidth="xl" {...props}>
    {children}
  </MuiContainer>
))`
  display: flex;
  overflow-x: hidden;
`;

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

type ColumnExtraProps = {
  visible: boolean;
  grow: number;
  basis: number | undefined;
};

const AccordionColumn = styled.div<ColumnExtraProps>`
  height: 100vh;
  min-width: 0;
  flex-grow: ${({ grow }) => grow};
  flex-basis: ${({ basis }) => basis};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: ${({ visible }) => (visible ? 'auto' : 0)};
`;
