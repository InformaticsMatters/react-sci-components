import React, { useState } from 'react';

import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

import { AppBar, Tab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { CloseButton, Content, Tabs, Title } from './components';
import Configuration from './Configuration';

// Types

interface IProps {
  width: number | string;
  height: number | string;
  titles: string[];
  draggable?: boolean;
  children: React.ReactNode;
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
      role="tabpanel"
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      aria-labelledby={`configuration-tab-${index}`}
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
const MultiPage: React.FC<IProps> = ({ width, height, titles, draggable = true, children }) => {
  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(false);

  return (
    <Configuration
      draggable={draggable}
      width={width}
      height={height}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Title id="configuration-title">
        <AppBar color="default">
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={(_, index) => {
              console.debug('click/touch');
              return setValue(index);
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Configuration for each part of the page"
          >
            {titles.map((title, i) => (
              <Tab
                id={`configuration-tab-${i}`}
                aria-controls={`configuration-tabpanel-${i}`}
                label={title}
                key={i}
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
            <TabPanel value={value} index={j} key={j}>
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
