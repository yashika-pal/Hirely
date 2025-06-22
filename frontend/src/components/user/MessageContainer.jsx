import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MESSAGE_API_END_POINT } from '@/utils/constant';
import { useSocketContext } from '@/context/SocketContext';

const MessageContainer = ({ recruiterId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useSelector(store => store.auth);
    const { socket } = useSocketContext();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${MESSAGE_API_END_POINT}/${recruiterId}`, { withCredentials: true });
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [recruiterId]);

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });
        return () => {
            socket?.off("newMessage");
        }
    }, [socket])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post(`${MESSAGE_API_END_POINT}/send/${recruiterId}`, { message: newMessage }, { withCredentials: true });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="w-full mx-auto my-10 p-4 border rounded-lg">
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg">
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.senderId?._id === user?._id ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`p-2 rounded-lg ${msg.senderId?._id === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-lg"
                    placeholder="Type a message..."
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageContainer; 