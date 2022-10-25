import { Box, styled } from '@mui/material';
import { pxToRem } from '@utils/text-size';

const TopWrapper = styled(Box)(({ theme }) => ({
  paddingBottom: pxToRem(80),
  [theme.breakpoints.down('lg')]: {
    paddingBottom: pxToRem(50),
  },
  [theme.breakpoints.down('sm')]: {
    paddingBottom: pxToRem(30),
  },
}));

const BottomWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  padding: pxToRem(50),
  marginBottom: pxToRem(50),
  marginTop: pxToRem(50),
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  display: 'flex',
  [theme.breakpoints.down('lg')]: {
    alignContent: 'center',
    justifyContent: 'center',
    padding: pxToRem(30),
  },
}));

const FormWrapper = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingTop: pxToRem(80),
  paddingLeft: pxToRem(80),
  paddingRight: pxToRem(80),
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    paddingTop: pxToRem(50),
    paddingLeft: pxToRem(50),
    paddingRight: pxToRem(50),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(100% - ${pxToRem(100)})`,
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: pxToRem(30),
    paddingLeft: pxToRem(30),
    paddingRight: pxToRem(30),
    width: `calc(100% - ${pxToRem(60)})`,
  },
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingTop: pxToRem(80),
  paddingLeft: pxToRem(80),
  paddingRight: pxToRem(80),
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    paddingTop: pxToRem(50),
    paddingLeft: pxToRem(50),
    paddingRight: pxToRem(50),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(100% - ${pxToRem(100)})`,
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: pxToRem(30),
    paddingLeft: pxToRem(30),
    paddingRight: pxToRem(30),
    width: `calc(100% - ${pxToRem(60)})`,
  },
}));

const FieldWrapper = styled('div')(({ theme }) => ({
  flexDirection: 'row',
  marginBottom: pxToRem(20),
  minHeight: pxToRem(70),
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: pxToRem(30),
  },
}));

export const EditContentElements = {
  FieldWrapper,
  FormWrapper,
  BottomWrapper,
  TopWrapper,
  ContentWrapper,
};
