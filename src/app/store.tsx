import { configureStore } from '@reduxjs/toolkit';

import timerReducer from './redux/features/mini-game/timer/timerSlice';
import menuReducer from './redux/features/menu/menuSlice';
import wordbookReducer from './redux/features/wordbook/wordbookSlice';
import diaryReducer from './redux/features/diary/diarySlice';
import authReducer from './redux/features/auth/authSlice';
import audiocallReducer from './redux/features/audiocall/audiocallSlice';
import sprintReducer from './redux/features/sprint/sprintSlice';
import { loadState } from './services/local-storage-service';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    menu: menuReducer,
    auth: authReducer,
    wordbook: wordbookReducer,
    sprint: sprintReducer,
    audiocall: audiocallReducer,
    // configs: configsReducer,
    diary: diaryReducer,
  },
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
