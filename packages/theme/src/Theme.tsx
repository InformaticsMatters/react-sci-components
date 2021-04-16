import React from 'react';

import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import shadows from '@material-ui/core/styles/shadows';

const family = ['"Open Sans"', 'Verdana', 'Geneva', 'Tahoma', 'sans-serif'].join(', ');

const breakpoints = createBreakpoints({});

export const theme = createMuiTheme({
  palette: {
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
  },
  overrides: {
    // MuiInput: {
    //   input: {
    //     fontSize: '0.5rem',
    //     padding: '6 4.5 6 4.5',
    //   },
    // },
    MuiPopover: {
      paper: {
        padding: 8,
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: shadows[1],
      },
    },
    MuiToolbar: {
      root: {
        minHeight: 60,
      },
      regular: {
        [breakpoints.up('xs')]: {
          minHeight: 60,
        },
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        [breakpoints.up('xs')]: {
          minWidth: 120,
        },
      },
      textColorInherit: {
        opacity: 1,
      },
    },
    MuiTabs: {
      root: {
        minHeight: 60,
      },
      flexContainer: {
        height: '100%',
      },
    },
  },
  typography: {
    fontFamily: family,
  },
});

export const MuiTheme: React.FC = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StylesProvider>
  );
};
