import React from 'react';

import SwipeableViews from 'react-swipeable-views';

import { AppBar, Tab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { CloseButton, Content, Tabs, Title } from './components';

// Types

interface IProps {
  titles: string[];
  close: () => void;
  children: React.ReactNode;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

// Display of section of configuration
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      aria-labelledby={`configuration-tab-${index}`}
      {...other}
    >
      {children}
      {/* {value === index && children} Might need to unmount for performance*/}
    </div>
  );
};

// Tabbed modal content
const MultiPage = ({ titles, close, children }: IProps) => {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Title id="configuration-title">
        <AppBar color="default">
          <Tabs
            onChange={(_, index) => setValue(index)}
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
        <CloseButton aria-label="close" onClick={close}>
          <CloseIcon />
        </CloseButton>
      </Title>
      <Content dividers id="configuration-content">
        <SwipeableViews index={value} onChangeIndex={(_, newValue) => setValue(newValue)}>
          {React.Children.map(children, (child, j) => (
            <TabPanel value={value} index={j} key={j}>
              {child}
            </TabPanel>
          ))}
        </SwipeableViews>
      </Content>
    </>
  );
};

export default MultiPage;
