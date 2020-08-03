import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Button, Container as MuiContainer, ContainerProps, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useComponentSize from '@rehooks/component-size';

interface IProps {
  children: (width: number) => JSX.Element[];
  labels: string[];
}

const NUMBER_OF_PANELS = 3;
const BUTTON_WIDTH = 48; //px === 3rem

const AccordionView = ({ children, labels }: IProps) => {
  // Container size
  const ref = useRef(null);
  const { width } = useComponentSize<HTMLDivElement>(ref);

  // Open panels
  const [open, setIsOpen] = useState([true, true, true]);

  const createHandleChange = (index: number) => () => {
    const newOpen = [...open];
    newOpen.splice(index, 1, !open[index]);
    if (newOpen.some((o) => o)) {
      setIsOpen(newOpen);
    }
  };

  const numPanelsOpen = open.filter((o) => o).length;
  const columnWidth = (width - NUMBER_OF_PANELS * BUTTON_WIDTH) / numPanelsOpen;
  // NGL Resize

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  });

  const panels = children(columnWidth);

  // Need to bind ref to div since container doesn't properly forwardRef to its root
  return (
    <div ref={ref}>
      <Container disableGutters>
        {
          React.Children.map(panels, (child, index) => (
            <>
              <VerticalButton
                disabled={numPanelsOpen === 1 && open[index]}
                onClick={createHandleChange(index)}
                fullWidth
              >
                <Typography noWrap variant="body2">
                  {labels[index]}
                </Typography>
              </VerticalButton>
              <AccordionColumn columnWidth={columnWidth} visible={open[index]}>
                {child}
              </AccordionColumn>
            </>
          ))!
        }
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
    boxShadow: theme.shadows[10],
    height: '100vh',
    minWidth: BUTTON_WIDTH,
    width: 0,
    borderRadius: 0,
  },
  label: {
    transform: 'rotate(-90deg)',
    width: '80vh',
  },
}))(Button);

const AccordionColumn = styled.section<{ visible: boolean; columnWidth: number }>`
  height: 100vh;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: ${({ visible, columnWidth }) => (visible ? columnWidth : 0)}px;
  transition: width 200ms ease;
`;
