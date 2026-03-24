// FOR AUTHENTICATION PURPOSES - frontend user slice

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // check for user info in local storage
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload; // dispatch(res) sets the payload to userInfo

      // write it as a JSON string to local storage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUserInfo, logoutUser } = userSlice.actions; // this sets dispatch() to handle payloads only

export default userSlice.reducer; // for Store
