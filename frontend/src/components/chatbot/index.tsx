'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('medical');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Available themes for the chatbot with improved design
  const themes = {
    medical: {
      container: "bg-white",
      chatbox: "bg-white border border-blue-200 shadow-lg",
      userBubble: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      botBubble: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200",
      input: "bg-white border-blue-300 text-gray-700 placeholder-gray-500 shadow-sm",
      button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      accent: "text-blue-600",
      title: "text-blue-700"
    },
  };

  // Effect to scroll down when chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Opening animation
  useEffect(() => {
    const container = document.querySelector('.chatbot-container');
    if (container) {
      container.classList.add('animate-fadeIn');
    }
  }, []);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    
    // Message sending animation
    const newMessage = { user: 'You', text: message, id: Date.now(), animated: true };
    setChatHistory(prev => [...prev, newMessage]);
    setLoading(true);
    setMessage('');
    
    try {
      // Check if it's an emergency question
      const emergencyKeywords = ['emergency', 'urgent', 'serious', 'ambulance', 'help', 'immediate'];
      const isEmergency = emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword));
      
      if (isEmergency && !isEmergencyMode) {
        setIsEmergencyMode(true);
        setTimeout(() => {
          const botMessage = {
            user: 'Health Assistant',
            text: "⚠️ It seems you're describing an emergency situation. If you are in danger, immediately call 911 (or your local emergency number). Would you like me to show you first aid instructions for this situation?",
            id: Date.now() + 1,
            animated: true,
            isEmergency: true
          };
          setChatHistory(prev => [...prev, botMessage]);
          setLoading(false);
        }, 700);
      } else {
        // Simulates a delay to give the impression that the AI is thinking
        const response = await axios.post('http://localhost:3000/chat/chat', { message });
        
        // "Typing" effect before displaying the response
        setTimeout(() => {
          const botMessage = {
            user: 'Health Assistant',
            text: response.data.message,
            id: Date.now() + 1,
            animated: true
          };
          setChatHistory(prev => [...prev, botMessage]);
          setLoading(false);
        }, 700);
      }
    } catch (error) {
      console.error('Error sending message to backend:', error);
      
      // Error message in case of a problem
      setChatHistory(prev => [...prev, {
        user: 'Health Assistant',
        text: "I'm sorry, I encountered a problem. Could you please try again?",
        id: Date.now() + 1,
        error: true
      }]);
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };
  
  const currentTheme = themes[theme];

  return (
    <div className={`chatbot-container relative flex flex-col items-center justify-center min-h-screen ${currentTheme.container} p-4 md:p-8 transition-all duration-500`}>
      {/* Background design element */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-64 -z-10 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-blue-300 via-purple-300 to-blue-500 transform -skew-y-6"></div>
      </div>
      
      {/* Additional decorative shape */}
      <div className="absolute bottom-0 right-0 w-64 h-64 -z-10 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transform translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      {/* Main chat container with improved shadow */}
      <div className={`relative z-10 ${currentTheme.chatbox} rounded-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl`}>
        {/* Improved chatbot header */}
        <div className="p-4 border-b relative overflow-hidden">
          {/* Subtle background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="mr-3 bg-blue-100 p-2 rounded-full shadow-sm">
                {/* Custom Logo */}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${currentTheme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${currentTheme.title}`}>HealthChat</h1>
                <p className={`${currentTheme.accent} text-xs`}>Available 24/7 for your health needs</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">              
              {/* Button to change theme with improved animation */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${currentTheme.accent} hover:bg-opacity-20 hover:bg-blue-100 transform hover:scale-110`}
                title="Change theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h10a2 2 0 012 2v12a4 4 0 01-4 4H7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message area with improved animation */}
        <div 
          ref={chatContainerRef}
          className="h-96 md:h-[400px] overflow-y-auto p-4 space-y-4 transition-all duration-300"
        >
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80">
              <div className={`${currentTheme.accent} mb-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className={`${currentTheme.accent} font-medium text-lg`}>
                How can I help you today?
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2 w-full max-w-xs">
                {[
                  "I'm having abdominal pain",
                  "How to prevent a cold?",
                  "What are the symptoms of stress?",
                  "I need nutritional advice"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessage(suggestion);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className={`text-xs p-3 rounded-lg border ${currentTheme.accent} border-blue-200 hover:bg-blue-50 hover:shadow-md transition-all duration-300 transform hover:scale-105`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${chat.user === 'You' ? 'justify-end' : 'justify-start'} ${chat.animated ? 'animate-fadeIn' : ''}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-xs md:max-w-sm shadow-sm ${
                  chat.user === 'You' 
                    ? currentTheme.userBubble + ' transform hover:translate-x-1 hover:shadow-md transition-all duration-300' 
                    : chat.error 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : chat.isEmergency
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : currentTheme.botBubble + ' transform hover:translate-x-1 hover:shadow-md transition-all duration-300'
                }`}
              >
                <div className="font-semibold text-xs mb-1 opacity-80">{chat.user}</div>
                <p className="text-sm leading-relaxed">{chat.text}</p>
              </div>
            </div>
          ))}
          
          {/* Improved typing indicator */}
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className={`p-3 rounded-xl ${currentTheme.botBubble} max-w-xs shadow-sm`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0s"}}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area and button with improved design */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gradient-to-r from-blue-50 to-indigo-50 bg-opacity-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 py-3 px-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-300 ${currentTheme.input} transition-all duration-300`}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className={`p-3 rounded-full ${currentTheme.button} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105`}
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Chatbot features below the chat box with improved design */}
      <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
        {[
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ),
            title: "AI Health Tech",
            desc: "Updated knowledge"
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: "Secure",
            desc: "Confidentiality guaranteed"
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            title: "Fast",
            desc: "Instant responses"
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center text-center p-3 rounded-xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md transform hover:scale-105 hover:translate-y-(-2px)`}
          >
            <div className={`${currentTheme.accent} mb-2 bg-blue-50 p-2 rounded-full`}>
              {feature.icon}
            </div>
            <h3 className={`font-medium text-sm text-gray-800`}>{feature.title}</h3>
            <p className={`text-xs text-gray-500 mt-1`}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Style for improved animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;