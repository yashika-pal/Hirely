import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { MESSAGE_API_END_POINT } from "@/utils/constant";
import { useSocketContext } from "@/context/SocketContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const MessageTest = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("Received new message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    try {
      console.log("Sending message to:", targetUserId);
      const res = await axios.post(
        `${MESSAGE_API_END_POINT}/send/${targetUserId}`,
        { message: newMessage },
        { withCredentials: true }
      );
      console.log("Message sent successfully:", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFetchMessages = async () => {
    if (!targetUserId) return;

    try {
      console.log("Fetching messages with:", targetUserId);
      const res = await axios.get(`${MESSAGE_API_END_POINT}/${targetUserId}`, {
        withCredentials: true,
      });
      console.log("Fetched messages:", res.data);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Message Test</h1>

      <div className="mb-4">
        <p>
          <strong>Current User:</strong> {user?.fullname} ({user?.role}) - ID:{" "}
          {user?._id}
        </p>
        <p>
          <strong>Socket Connected:</strong> {socket ? "Yes" : "No"}
        </p>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          placeholder="Enter target user ID"
          className="mb-2"
        />
        <Button onClick={handleFetchMessages} className="mr-2">
          Fetch Messages
        </Button>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || !targetUserId}>
            Send
          </Button>
        </form>
      </div>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto">
        <h3 className="font-bold mb-2">Messages:</h3>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 p-2 rounded ${
                msg.senderId === user?._id
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <p>
                <strong>{msg.senderId === user?._id ? "You" : "Other"}:</strong>{" "}
                {msg.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageTest;
