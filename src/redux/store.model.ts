import { useDispatch } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import store from './store';

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
