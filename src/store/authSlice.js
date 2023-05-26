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
        removeInvite: (state, action) => {
            state.user.invites = state.user.invites.filter(
                (inv) => inv != action.payload
            );
        },
    },
});

export const { login, logout, removeInvite } = authSlice.actions;
export default authSlice.reducer;
