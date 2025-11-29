import type {PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth, db} from '../firebaseConfig';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {toast} from 'react-toastify';

export interface User {
    email: string;
    name?: string;
    uid: string;
    role: 'admin' | 'user';
    token: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
}

const savedUser = localStorage.getItem('user');
const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
    error: null,
};

export const registerUser = createAsyncThunk<
    User,
    { email: string; password: string; name: string; role: 'admin' | 'user' },
    { rejectValue: string }
>('auth/register', async ({email, password, name, role}, thunkAPI) => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const token = await cred.user.getIdToken();

        const newUser: User = {
            email: cred.user.email || '',
            uid: cred.user.uid,
            name,
            role,
            token,
        };

        await setDoc(doc(db, 'users', cred.user.uid), newUser);
        return newUser;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return thunkAPI.rejectWithValue(message);
    }
});

export const loginUser = createAsyncThunk<
    User,
    { email: string; password: string },
    { rejectValue: string }
>('auth/login', async ({email, password}, thunkAPI) => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const token = await cred.user.getIdToken();

        const docSnap = await getDoc(doc(db, 'users', cred.user.uid));
        if (!docSnap.exists()) return thunkAPI.rejectWithValue('User data not found');

        const userData = docSnap.data() as User;
        const userWithToken = {...userData, token};

        return userWithToken;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return thunkAPI.rejectWithValue(message);
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await signOut(auth);
    localStorage.removeItem('user');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload));
            else localStorage.removeItem('user');
        },
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload || 'Registration failed';
                toast.error(state.error);
                alert('Something went wrong!');
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload || 'Login failed';
                toast.error(state.error);
                alert('Something went wrong!');
            })
            .addCase(logoutUser.fulfilled, state => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
            });
    },
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;
