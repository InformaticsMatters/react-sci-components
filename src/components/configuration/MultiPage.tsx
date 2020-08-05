import React, { useState } from 'react';

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
      {value === index && children}
    </div>
  );
};

/**
 *  Tabbed modal content for ./Configuration
 * @param titles the the text displayed in tabs
 * @param close the function to be called when the close X is clicked
 *
 * @param children the content of each panel. This is mapped over with React.Children.map
 */
const MultiPage: React.FC<IProps> = ({ titles, close, children }) => {
  const [value, setValue] = useState(0);

  return (
    <>
      <Title id="configuration-title">
        <AppBar color="default">
          <Tabs
            value={value}
            indicatorColor="primary"
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
