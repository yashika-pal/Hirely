import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MESSAGE_API_END_POINT } from '@/utils/constant';
import { useSocketContext } from '@/context/SocketContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { SendHorizonal, User } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useSelector(store => store.auth);
    const { socket } = useSocketContext();
    const messageEndRef = useRef(null);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}/conversations`, { withCredentials: true });
            setConversations(res.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            if (selectedConversation) {
                const participants = selectedConversation.participants.map(p => (p._id || p));
                if (participants.includes(newMessage.senderId) && participants.includes(newMessage.receiverId)) {
                    setMessages(prev => [...prev, newMessage]);
                }
            }
            fetchConversations();
        };

        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    }, [socket, selectedConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        const otherParticipant = getOtherParticipant(conversation);
        if (!otherParticipant) return;
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}/${otherParticipant._id}`, { withCredentials: true });
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const otherParticipant = getOtherParticipant(selectedConversation);
        if (!otherParticipant) return;

        try {
            const res = await axios.post(`${MESSAGE_API_END_POINT}/send/${otherParticipant._id}`, { message: newMessage }, { withCredentials: true });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            const updatedConversations = conversations.map(c =>
                c._id === selectedConversation._id ? { ...c, messages: [res.data] } : c
            ).sort((a, b) =>
                a._id === selectedConversation._id ? -1 : b._id === selectedConversation._id ? 1 : 0
            );
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getOtherParticipant = (conversation) => {
        if (!conversation || !conversation.participants) return null;
        return conversation.participants.find(p => p._id !== user._id);
    };

    const getLastMessage = (conversation) => {
        if (!conversation.messages || conversation.messages.length === 0) return 'No messages yet';
        const lastMsg = conversation.messages[0];
        const prefix = (lastMsg.senderId?._id || lastMsg.senderId) === user._id ? "You: " : "";
        return prefix + (lastMsg.message.length > 30 ? lastMsg.message.substring(0, 30) + '...' : lastMsg.message);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1 flex max-w-7xl mx-auto w-full my-6 gap-6 px-4 overflow-hidden">
                {/* Conversations List */}
                <div className="w-1/3 bg-white border rounded-lg flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold">Chats</h2>
                    </div>
                    <ScrollArea className="flex-1">
                        {conversations.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">No conversations.</p>
                        ) : (
                            conversations.map((conv) => {
                                const otherUser = getOtherParticipant(conv);
                                if (!otherUser) return null;
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`p-4 flex items-center gap-4 cursor-pointer border-l-4 ${selectedConversation?._id === conv._id ? 'border-purple-600 bg-purple-50' : 'border-transparent'} hover:bg-gray-100 transition-colors duration-200`}
                                    >
                                        <Avatar>
                                            <AvatarImage src={otherUser?.profile?.profilePhoto} />
                                            <AvatarFallback>{otherUser?.fullname?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{otherUser?.fullname}</p>
                                            <p className="text-sm text-gray-500 truncate">{getLastMessage(conv)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </ScrollArea>
                </div>

                {/* Messages Area */}
                <div className="w-2/3 bg-white border rounded-lg flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={getOtherParticipant(selectedConversation)?.profile?.profilePhoto} />
                                    <AvatarFallback>{getOtherParticipant(selectedConversation)?.fullname?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{getOtherParticipant(selectedConversation)?.fullname}</p>
                                    <p className="text-sm text-gray-500">{getOtherParticipant(selectedConversation)?.email}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-6 bg-gray-100/50">
                                <div className="space-y-4">
                                    {messages.map((msg) => {
                                        const isSender = (msg.senderId?._id || msg.senderId) === user._id;
                                        return (
                                            <div key={msg._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-md p-3 rounded-2xl ${isSender ? 'bg-[#6A38C2] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                                                    <p>{msg.message}</p>
                                                    <p className={`text-xs mt-1 text-right ${isSender ? 'text-purple-200' : 'text-gray-500'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messageEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#6A38C2]"
                                        placeholder="Type a message..."
                                    />
                                    <Button type="submit" disabled={!newMessage.trim()} className="rounded-full w-12 h-12">
                                        <SendHorizonal />
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10">
                            <div className="bg-gray-100 p-8 rounded-full mb-6">
                                <User size={60} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700">Select a Chat</h2>
                            <p className="text-gray-500 mt-2">Choose from your existing conversations to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages; 