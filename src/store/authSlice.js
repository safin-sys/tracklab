import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        isLoggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        updateInvitations: (state, action) => {
            state.user.invitations = action.payload;
        },
    },
});

export const { login, logout, updateInvitations } = authSlice.actions;
export default authSlice.reducer;
