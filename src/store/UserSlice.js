import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  location: '',
};

const userSlice = createSlice({
  name: 'CarUser',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload; // Update state with fetched user details
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
