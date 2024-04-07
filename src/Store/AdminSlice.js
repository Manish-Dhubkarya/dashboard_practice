import { createSlice } from "@reduxjs/toolkit";
const storedAdmins = localStorage.getItem('admins');
const initialState = {
  admins: storedAdmins ? JSON.parse(storedAdmins) : [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    registerAdmin: (state, action) => {
      state.admins.push(action.payload);
      localStorage.setItem('admins', JSON.stringify(state.admins));
    },
  },
});

export const { registerAdmin } = adminSlice.actions;

export default adminSlice.reducer;