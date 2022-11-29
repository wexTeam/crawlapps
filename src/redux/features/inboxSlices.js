import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    refresh: false,
}

export const inboxSlices = createSlice({
    name: 'inbox',
    initialState,
    reducers: {
        refreshInbox: (state) => {
            state.refresh = true;
        },
        resetInbox: (state) => {
            state.refresh = true;
        }
    },
})

// Action creators are generated for each case reducer function
export const { refreshInbox, resetInbox } = inboxSlices.actions

export default inboxSlices.reducer