import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

export const TravelerChatPage  = () =>  {
  // Get user IDs from local storage - for traveler, the traveler_Id is their ID
  const travelerId = localStorage.getItem('traveler_Id');
  
  // State for managing messages and senders
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState([]);
  const [activeSenderId, setActiveSenderId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Fetch all senders who have chatted with this traveler
  useEffect(() => {
    const fetchSenders = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/messages/senders?travelerId=${travelerId}`);
        const data = await response.json();
        setSenders(data);
        
        // Set first sender as active if none is selected
        if (data.length > 0 && !activeSenderId) {
          setActiveSenderId(data[0].senderId);
        }
      } catch (error) {
        console.error('Error fetching senders:', error);
      }
    };
    
    if (travelerId) {
      fetchSenders();
    }
  }, [travelerId, activeSenderId]);
  
  // Fetch sender details when active sender changes
  useEffect(() => {
    const fetchSenderDetails = async () => {
      if (!activeSenderId) return;
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/senders/${activeSenderId}`);
        const data = await response.json();
        setActiveChat(data);
      } catch (error) {
        console.error('Error fetching sender details:', error);
      }
    };
    
    fetchSenderDetails();
  }, [activeSenderId]);
  
  // Fetch message history for active sender
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeSenderId) return;
      
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/messages?senderId=${activeSenderId}&travelerId=${travelerId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeSenderId && travelerId) {
      fetchMessages();
      
      // Set up polling for new messages
      const intervalId = setInterval(fetchMessages, 5000);
      return () => clearInterval(intervalId);
    }
  }, [activeSenderId, travelerId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeSenderId) return;
    
    // Optimistically add message to UI
    const tempMessage = {
      id: Date.now(),
      content: newMessage,
      senderId: activeSenderId,
      travelerId: travelerId,
      senderMessage: false,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: activeSenderId,
          travelerId: travelerId,
          content: newMessage,
          senderMessage: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message if it failed
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex items-center">
        <button className="mr-4" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg">My Messages</h1>
          <p className="text-xs text-gray-500">Chat with your trip organizers</p>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sender list sidebar */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <div className="p-3 font-medium text-gray-700 border-b">
            Trip Organizers
          </div>
          {senders.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              No messages yet.
            </div>
          ) : (
            senders.map((sender) => (
              <div 
                key={sender.senderId}
                onClick={() => setActiveSenderId(sender.senderId)}
                className={`p-3 border-b cursor-pointer ${
                  sender.senderId === activeSenderId ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{sender.name}</div>
                <div className="text-xs text-gray-500">
                  {sender.latestMessage ? 
                    `${sender.latestMessage.slice(0, 30)}${sender.latestMessage.length > 30 ? '...' : ''}` :
                    'No messages'
                  }
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Active chat info */}
          {activeChat && (
            <div className="bg-white p-3 shadow-sm border-b">
              <div className="font-medium">{activeChat.name}</div>
              <div className="text-xs text-gray-500">{activeChat.email || 'No email available'}</div>
            </div>
          )}
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            {!activeSenderId ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                <p>Select a sender to view messages</p>
              </div>
            ) : loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                <p>No messages yet with this sender.</p>
              </div>
            ) : (
              messages.map((message) => {
                const isTravelerMessage = !message.senderMessage;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex mb-4 ${isTravelerMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        isTravelerMessage 
                          ? 'bg-green-500 text-white rounded-br-none' 
                          : 'bg-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isTravelerMessage ? 'text-green-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          {activeSenderId && (
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full ${
                    !newMessage.trim() ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

