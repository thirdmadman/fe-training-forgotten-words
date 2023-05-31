import { configureStore } from '@reduxjs/toolkit';

import timerReducer from './redux/features/timer/timerSlice';
import menuReducer from './redux/features/menu/menuSlice';

export const store = configureStore({
  reducer: {
    timerReducer,
    menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
