import React, { useState } from 'react';

import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

import { AppBar, ButtonProps, Tab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { CloseButton, Content, Tabs, Title } from './components';
import Configuration from './Configuration';

// Types

interface IProps {
  width: number | string;
  height: number | string;
  titles: string[];
  buttonProps: ButtonProps;
  draggable?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

// Display of section of configuration
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <Panel
      aria-labelledby={`configuration-tab-${index}`}
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {children}
    </Panel>
  );
};

/**
 *  Tabbed modal content for ./Configuration
 * @param titles the the text displayed in tabs
 * @param close the function to be called when the close X is clicked
 *
 * @param children the content of each panel. This is mapped over with React.Children.map
 */
const MultiPage: React.FC<IProps> = ({
  width,
  height,
  titles,
  draggable = true,
  children,
  buttonProps,
}) => {
  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(false);

  return (
    <Configuration
      buttonProps={buttonProps}
      draggable={draggable}
      height={height}
      open={open}
      width={width}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Title id="configuration-title">
        <AppBar color="default">
          <Tabs
            aria-label="Configuration for each part of the page"
            indicatorColor="primary"
            scrollButtons="auto"
            value={value}
            variant="scrollable"
            onChange={(_, index) => setValue(index)}
          >
            {titles.map((title, i) => (
              <Tab
                aria-controls={`configuration-tabpanel-${i}`}
                id={`configuration-tab-${i}`}
                key={i}
                label={title}
              />
            ))}
          </Tabs>
        </AppBar>
        <CloseButton aria-label="close" onClick={() => setOpen(false)}>
          <CloseIcon />
        </CloseButton>
      </Title>
      <Content dividers id="configuration-content">
        <SwipeableViews index={value} onChangeIndex={(newValue) => setValue(newValue)}>
          {React.Children.map(children, (child, j) => (
            <TabPanel index={j} key={j} value={value}>
              {child}
            </TabPanel>
          ))}
        </SwipeableViews>
      </Content>
    </Configuration>
  );
};

export default MultiPage;

const Panel = styled.div`
  height: calc(80vh - 64px);
`;
