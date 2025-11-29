import React from 'react';
import type {Room} from "../../store/roomsSlice.ts";
import {Users} from "phosphor-react";
import {Edit, Trash2} from "lucide-react";
import {useSelector} from "react-redux";
import type {RootState} from "../../store";

interface RoomCardProps {
    room: Room;
    onEdit: (room: Room) => void;
    onDelete: (id: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({room, onEdit, onDelete}) => {
    const {user} = useSelector((state: RootState) => state.auth);
    const isAdmin = (user?.email === 'admin@gmail.com' || user?.role === 'admin');

    return (
        <div className="border rounded-lg p-4 bg-white shadow flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <div className="flex gap-2">
                    {isAdmin && (<button
                        onClick={() => onEdit(room)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit size={16}/>
                    </button>)}
                    {isAdmin && <button
                        onClick={() => onDelete(room.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={16}/>
                    </button>}
                </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">{room.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
                <Users size={16}/>
                <span>{room.capacity} people</span>
            </div>
        </div>
    );
};

export default RoomCard;
