import { configureStore } from '@reduxjs/toolkit';

import timerReducer from './redux/features/timer/timerSlice';

export const store = configureStore({
  reducer: {
    timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
