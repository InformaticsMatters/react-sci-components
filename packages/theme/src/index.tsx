import React from 'react';

import {
  ThemeProvider as MuiThemeProvider,
  StylesProvider,
  createMuiTheme,
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
      light: '#e1a436',
      main: '#cc7013',
      dark: '#c15b0f',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    success: {
      light: '#5efc82',
      main: '#00c853',
      dark: '#009624',
      contrastText: '#fff',
    },
  },
  overrides: {
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
        minHeight: 80,
      },
      regular: {
        [breakpoints.up('xs')]: {
          minHeight: 80,
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
  props: {
    MuiTextField: {
      variant: 'outlined',
      size: 'small',
    },
    MuiButton: {
      disableRipple: true,
      disableFocusRipple: true,
    },
    MuiTooltip: {
      arrow: true,
    },
  },
});

export const MuiTheme: React.FC = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StylesProvider>
  );
};

export default MuiTheme;
