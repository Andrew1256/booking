import {useSelector} from 'react-redux';
import {format, isToday, parseISO} from 'date-fns';
import {MapPin} from 'lucide-react';
import type {RootState} from "../../store";

const Dashboard = () => {
    const {user} = useSelector((state: RootState) => state.auth);
    const {bookings} = useSelector((state: RootState) => state.bookings);
    const {rooms} = useSelector((state: RootState) => state.rooms);

    const myBookings = bookings.filter(b => b.userId === user?.email);
    const todayBookings = bookings.filter(b => isToday(parseISO(b.startTime)));

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-xl font-semibold">Welcome back, {user?.name}!</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded p-4">
                    <h3 className="text-sm text-gray-500">My Upcoming Bookings</h3>
                    <p className="text-2xl font-bold">{myBookings.length}</p>
                </div>
                <div className="border rounded p-4">
                    <h3 className="text-sm text-gray-500">Total Bookings Today</h3>
                    <p className="text-2xl font-bold">{todayBookings.length}</p>
                </div>
                <div className="border rounded p-4">
                    <h3 className="text-sm text-gray-500">Available Rooms</h3>
                    <p className="text-2xl font-bold text-amber-800">{rooms.length}</p>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Today's Schedule</h2>
                <div className="space-y-2">
                    {todayBookings.length === 0 ? (
                        <p className="text-sm text-gray-500">No bookings for today.</p>
                    ) : (
                        todayBookings
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .map(booking => {
                                const room = rooms.find(r => r.id === booking.roomId);
                                return (
                                    <div key={booking.id} className="border rounded p-3 flex gap-4 items-start">
                                        <div className="text-blue-600 font-mono min-w-[60px]">
                                            {format(parseISO(booking.startTime), 'HH:mm')}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{booking.description}</h4>
                                            <div className="text-sm text-gray-500 flex gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin size={14}/> {room?.name}
                        </span>
                                                <span className="flex items-center gap-1">
                          <UserIcon size={14}/> {booking.userName}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            </div>
        </div>
    );
};

const UserIcon = ({size}: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

export default Dashboard;
