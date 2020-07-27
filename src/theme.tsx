import React from 'react';

import { ThemeProvider } from 'styled-components';

import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';

const palette = {
  common: {
    black: '#000',
    white: 'rgba(236, 240, 241, 1)',
  },
  background: {
    paper: '#fff',
    default: '#fafafa',
  },
  primary: {
    light: 'rgba(255, 125, 102, 1)',
    main: 'rgba(229, 74, 59, 1)',
    dark: 'rgba(172, 7, 19, 1)',
    contrastText: '#fff',
  },
  secondary: {
    light: 'rgba(225, 255, 255, 1)',
    main: 'rgba(175, 207, 207, 1)',
    dark: 'rgba(127, 158, 158, 1)',
    contrastText: '#fff',
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#fff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
  overrides: {
    MuiInput: {
      input: {
        fontSize: '0.5rem',
        padding: '6 4.5 6 4.5',
      },
    },
  },
};

export const theme = createMuiTheme({ palette });

const Theme: React.FC = ({ children }) => (
  <StylesProvider injectFirst>
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiThemeProvider>
  </StylesProvider>
);

export default Theme;
