import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

export interface Booking {
    id: string;
    roomId: string;
    userId: string;
    userName: string;
    startTime: string;
    endTime: string;
    description: string;
    attendees: string[];
}

export interface BookingsState {
    bookings: Booking[];
}

const initialState: BookingsState = {
    bookings: [],
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings.push(action.payload);
        },

        deleteBooking: (state, action: PayloadAction<string>) => {
            state.bookings = state.bookings.filter(b => b.id !== action.payload);
        },
    },
});

export const {addBooking, deleteBooking} = bookingsSlice.actions;
export default bookingsSlice.reducer;
