import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';

export const SenderChatPage = () => {
  const senderId = localStorage.getItem('userId');
  const tripId = localStorage.getItem('tripId') ? JSON.parse(localStorage.getItem('tripId')) : null;
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch travelers that the user has chatted with
  useEffect(() => {
    const fetchTravelers = async () => {
      if (!senderId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/chats/partners?userId=${senderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch travelers');
        }
        
        const travelerIds = await response.json();
        // Map to traveler objects with minimal info
        const travelerList = travelerIds.map(id => ({
          id,
          name: `Traveler ${id}` // You might want to fetch actual names from another endpoint
        }));
        
        setTravelers(travelerList);
        setError(null);
      } catch (err) {
        console.error('Error fetching travelers:', err);
        setError('Failed to load travelers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTravelers();
  }, [senderId]);

  // Fetch messages when a traveler is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedTraveler || !senderId) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `/api/chats?senderId=${senderId}&receiverId=${selectedTraveler.id}`
        );
        
        if (!response.ok) {
          throw new Error('Could not fetch messages');
        }
        
        const data = await response.json();
        // Map to frontend message format
        const formattedMessages = data.map(msg => ({
          id: msg.chatId,
          content: msg.message,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          senderMessage: msg.senderId.toString() === senderId,
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedTraveler, senderId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTraveler || !senderId) return;

    // Create temporary message (optimistic UI)
    const tempMessage = {
      id: Date.now(), // temporary ID
      content: newMessage,
      senderId: parseInt(senderId),
      receiverId: selectedTraveler.id,
      senderMessage: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: parseInt(senderId),
          receiverId: selectedTraveler.id,
          message: newMessage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const savedMessage = await response.json();
      // Replace temporary message with saved one from server
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, id: savedMessage.chatId } 
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove temporary message if send fails
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setError('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!senderId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access the chat feature.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow p-4 flex items-center">
        {selectedTraveler && (
          <button 
            className="mr-4" 
            onClick={() => setSelectedTraveler(null)}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="font-bold text-lg">Chat</h1>
          <p className="text-sm text-gray-500">
            {selectedTraveler 
              ? `Chatting with ${selectedTraveler.name}`
              : 'Select a traveler to chat'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex justify-center">
            <p>Loading...</p>
          </div>
        )}

        {selectedTraveler ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Chat with {selectedTraveler.name}</h2>
            </div>

            {messages.length === 0 && !loading ? (
              <p className="text-gray-500 text-center mt-8">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.senderMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.senderMessage
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Conversations</h2>
            {travelers.length === 0 && !loading ? (
              <p className="text-gray-500">No conversations yet.</p>
            ) : (
              travelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="mb-4 p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedTraveler(traveler)}
                >
                  <p className="font-bold">{traveler.name}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedTraveler && (
        <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className={`p-2 rounded-full ${
                !newMessage.trim() || loading
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};