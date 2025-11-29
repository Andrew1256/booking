import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

export interface Room {
    id: string;
    name: string;
    description: string;
    capacity: number;
}

export interface RoomsState {
    rooms: Room[];
}

const initialState: RoomsState = {
    rooms: [
        { id: '1', name: 'Conference Room A', description: 'Large room with projector', capacity: 20 },
        { id: '2', name: 'Meeting Room B', description: 'Small room for quick syncs', capacity: 5 },
    ],
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        addRoom: (state, action: PayloadAction<Room>) => {
            state.rooms.push(action.payload);
        },
        updateRoom: (state, action: PayloadAction<Room>) => {
            const index = state.rooms.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        },
        deleteRoom: (state, action: PayloadAction<string>) => {
            state.rooms = state.rooms.filter(r => r.id !== action.payload);
        },
    },
});

export const { addRoom, updateRoom, deleteRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
