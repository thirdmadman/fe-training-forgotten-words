import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetStateAuth } from '../../auth/authSlice';

interface SprintTimerState {
  timerRemainTime: number;
}

const initialState: SprintTimerState = {
  timerRemainTime: -1,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setRemainTime: (state, action: PayloadAction<number>) => {
      state.timerRemainTime = action.payload;
    },
    resetAction: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(resetStateAuth, () => initialState);
  },
});

export const { setRemainTime, resetAction } = timerSlice.actions;

export default timerSlice.reducer;
