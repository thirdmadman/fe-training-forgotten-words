import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { setRemainTime } = timerSlice.actions;

export default timerSlice.reducer;
