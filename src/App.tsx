import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from './store';
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Rooms from './pages/Rooms/Rooms';
import Bookings from './pages/Booking/Booking';
import Layout from './pages/Layout/Layout';

import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebaseConfig';
import {setUser} from './store/authSlice';

const PrivateRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login"/>;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const token = await fbUser.getIdToken();

                dispatch(setUser({
                    role: 'user',
                    email: fbUser.email ?? '',
                    uid: fbUser.uid,
                    name: fbUser.displayName ?? '',
                    token,
                }));
            } else {
                dispatch(setUser(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout/>
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard"/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="rooms" element={<Rooms/>}/>
                    <Route path="bookings" element={<Bookings/>}/>
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
