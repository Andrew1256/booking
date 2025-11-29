import React from "react";
import {X} from "phosphor-react";

interface ModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    error?: string;
    rooms: { id: string; name: string; capacity: number }[];
    formData: {
        roomId: string;
        date: string;
        startTime: string;
        endTime: string;
        description: string;
        attendees: string;
    };
    setFormData: (value: any) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const Modal: React.FC<ModalProps> = ({
                                         isModalOpen,
                                         setIsModalOpen,
                                         error,
                                         rooms,
                                         formData,
                                         setFormData,
                                         handleSubmit,
                                     }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">New Booking</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                        <X size={20}/>
                    </button>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Room</label>
                        <select
                            value={formData.roomId}
                            onChange={e => setFormData({...formData, roomId: e.target.value})}
                            required
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select a room</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.name} (Cap: {room.capacity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Meeting purpose"
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Attendees (comma-separated emails)</label>
                        <input
                            type="text"
                            value={formData.attendees}
                            onChange={e => setFormData({...formData, attendees: e.target.value})}
                            placeholder="colleague@example.com, boss@example.com"
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Book Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;

