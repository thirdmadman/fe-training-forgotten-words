import { createSlice } from '@reduxjs/toolkit';

interface MenuState {
  isHidden: boolean;
}

const initialState: MenuState = {
  isHidden: true,
};

export const menuSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    hideMenu: (state) => {
      state.isHidden = true;
    },
    showMenu: (state) => {
      state.isHidden = false;
    },
  },
});

export const { hideMenu, showMenu } = menuSlice.actions;

export default menuSlice.reducer;
