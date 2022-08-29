import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Fade } from '@mui/material';
import { pxToRem } from '@utils/text-size';

const palette = {
  background: {
    default: '#141414',
    paper: '#FFFFFF',
  },
  primary: {
    main: '#009FE3',
  },
  secondary: {
    main: '#5A2583',
  },
  error: {
    main: '#BF0909',
  },
  info: {
    main: '#FFFFFF',
    dark: '#7C7C7C',
  },
};

export const SwTheme = responsiveFontSizes(
  createTheme({
    spacing: (factor) => `${0.25 * factor}rem`, // (Bootstrap strategy)
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '*::-webkit-scrollbar': {
              width: '10px',
            },
            '*::-webkit-scrollbar-track': {
              background: '#E4EFEF',
            },
            '*::-webkit-scrollbar-thumb': {
              background: '#1D388F61',
              borderRadius: '2px',
            },
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          TransitionComponent: Fade,
        },
      },
      MuiUseMediaQuery: {
        defaultProps: {
          noSsr: true,
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: palette.primary.main,
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette,
    shape: {
      borderRadius: 0,
    },
    typography: {
      fontSize: 10,
      button: {
        fontSize: '1.25rem', // 20px
      },
      body1: {
        // letterSpacing: '2.1px',
        font: `normal normal 900 ${pxToRem(16)}/${pxToRem(32)} Avenir`,
      },
      body2: {
        fontSize: pxToRem(14),
        // letterSpacing: '2px',
      },
      emphasis: {
        fontSize: pxToRem(25),
        // letterSpacing: '0px',
        font: `oblique normal 900 ${pxToRem(25)}/${pxToRem(45)} Avenir`,
      },
      subtitle1: {
        fontSize: pxToRem(25),
        // letterSpacing: '0',
      },
      subtitle2: {
        fontSize: pxToRem(20),
        // letterSpacing: '0',
      },
      h1: {
        fontSize: pxToRem(60),
        // letterSpacing: '0.96px',
      },
      h2: {
        fontSize: pxToRem(48),
        // letterSpacing: '0.77px',
      },
      h3: {
        fontSize: pxToRem(40),
        // letterSpacing: '0.64px',
      },
      h4: {
        fontSize: pxToRem(30),
        // letterSpacing: '0.77px',
      },
      h5: {
        fontSize: pxToRem(24),
        // letterSpacing: '0.48px',
      },
      h6: {
        fontSize: pxToRem(18),
        // letterSpacing: '0.38px',
      },
      xl: {
        fontSize: '5rem',
      },
      xxl: {
        fontSize: '6.25rem',
      },
      fontFamily: ['Avenir', ' sans-serif'].join(','),
    },
  })
);

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    xl: React.CSSProperties;
    xxl: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }

  interface TypographyOptions {
    xl?: React.CSSProperties;
    xxl: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    xl: true;
    xxl: true;
    emphasis?: true;
  }
}
