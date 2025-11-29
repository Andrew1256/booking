import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from "../../store";
import {logoutUser} from "../../store/authSlice.ts";
import {CalendarDays, DoorOpen, LayoutDashboard, LogOut, User} from "lucide-react";

const Layout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {user} = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const navItems = [
        {path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
        {path: '/rooms', label: 'Rooms', icon: DoorOpen},
        {path: '/bookings', label: 'Bookings', icon: CalendarDays},
    ];

    return (
        <div className="flex h-screen">
            <aside className="w-64 h-screen bg-white text-blue-500 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-8">MeetingRoom</h2>
                    <nav className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({isActive}) =>
                                    `flex items-center space-x-4 p-2 rounded transition ${
                                        isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                    }`
                                }
                            >
                                <item.icon size={20}/>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center ml-2 space-x-5 justify-between">
                    <User size={30}/>
                    <p>{user?.name}</p>
                    <button onClick={handleLogout}>
                        <LogOut size={30}/>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <Outlet/>
            </main>
        </div>

    );
};

export default Layout;
