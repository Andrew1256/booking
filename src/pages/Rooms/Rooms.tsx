import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from "../../store";
import {addRoom, deleteRoom, type Room, updateRoom} from "../../store/roomsSlice.ts";
import RoomCard from "../RoomCard/RoomCard.tsx";
import {Plus, X} from "phosphor-react";

const Rooms = () => {
    const {rooms} = useSelector((state: RootState) => state.rooms);
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);
    const isAdmin = (user?.email === 'admin@gmail.com' || user?.role === 'admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState({name: '', description: '', capacity: 0});

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setFormData({name: room.name, description: room.description, capacity: room.capacity});
        } else {
            setEditingRoom(null);
            setFormData({name: '', description: '', capacity: 0});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            dispatch(updateRoom({...editingRoom, ...formData}));
        } else {
            dispatch(addRoom({id: Date.now().toString(), ...formData}));
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            dispatch(deleteRoom(id));
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Meeting Rooms</h1>
                {isAdmin && (<button onClick={() => handleOpenModal()}
                                     className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    <Plus size={20}/>
                    Add Room
                </button>)}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md rounded p-6 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={handleCloseModal}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Room Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Capacity</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                                    required
                                    min="1"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded">
                                    Cancel
                                </button>
                                <button type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
