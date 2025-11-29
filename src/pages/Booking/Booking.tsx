import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addBooking, type Booking, deleteBooking} from '../../store/bookingsSlice.ts';
import {format, isWithinInterval, parseISO} from 'date-fns';
import {Calendar, Clock, MapPin, Plus} from 'phosphor-react';
import Modal from './Modal.tsx';
import type {RootState} from '../../store';

const Bookings = () => {
    const {bookings} = useSelector((state: RootState) => state.bookings);
    const {rooms} = useSelector((state: RootState) => state.rooms);
    const {user} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        roomId: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        attendees: '',
    });
    const [error, setError] = useState('');
    const isAdmin = (user?.email === 'admin@gmail.com' || user?.role === 'admin');

    const handleOpenModal = () => {
        setFormData({
            roomId: rooms[0]?.id || '',
            date: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            endTime: '10:00',
            description: '',
            attendees: '',
        });
        setIsModalOpen(true);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        if (startDateTime >= endDateTime) {
            setError('End time must be after start time');
            return;
        }

        const hasConflict = bookings.some(booking => {
            if (booking.roomId !== formData.roomId) return false;
            const bookingStart = parseISO(booking.startTime);
            const bookingEnd = parseISO(booking.endTime);
            return (
                isWithinInterval(startDateTime, {start: bookingStart, end: bookingEnd}) ||
                isWithinInterval(endDateTime, {start: bookingStart, end: bookingEnd}) ||
                (startDateTime <= bookingStart && endDateTime >= bookingEnd)
            );
        });

        if (hasConflict) {
            setError('This room is already booked for the selected time slot');
            return;
        }

        const newBooking: Booking = {
            id: Date.now().toString(),
            roomId: formData.roomId,
            userId: user?.email || '',
            userName: user?.name || '',
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            description: formData.description,
            attendees: formData.attendees.split(',').map(e => e.trim()).filter(e => e),
        };

        dispatch(addBooking(newBooking));
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Cancel this booking?')) {
            dispatch(deleteBooking(id));
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Bookings</h1>
                {isAdmin && <button onClick={handleOpenModal}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={20}/> New Booking
                </button>}
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings found.</p>
                ) : (
                    bookings.map(booking => {
                        const room = rooms.find(r => r.id === booking.roomId);
                        return (
                            <div key={booking.id}
                                 className="border border-gray-300 rounded p-4 shadow-sm flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.description || 'No Description'}</h3>
                                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16}/> <span>{room?.name || 'Unknown Room'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16}/>
                                            <span>{format(parseISO(booking.startTime), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16}/>
                                            <span>{format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm mt-2 text-gray-700">Organized by: {booking.userName}</div>
                                </div>
                                {isAdmin && (<button onClick={() => handleDelete(booking.id)}
                                                     className="text-red-600 hover:underline text-sm">Cancel
                                </button>)}
                            </div>
                        );
                    })
                )}
            </div>

            <Modal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                error={error}
                rooms={rooms}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default Bookings;
