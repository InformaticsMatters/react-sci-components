import React from 'react';

import { ThemeProvider } from 'styled-components';

import { MuiTheme, theme } from './Theme';

export const Theme: React.FC = ({ children }) => {
  return (
    <MuiTheme>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiTheme>
  );
};

export default Theme;
