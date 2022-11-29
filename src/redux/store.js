import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlices'
import userReducer from './features/userSlices'
import inboxReducer from './features/inboxSlices'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        inbox: inboxReducer,
    },
})