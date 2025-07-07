import { useState } from 'react';
import useSignalR from './hooks/useSignalR';
import './App.css';

function App() {
  const [inputUserId, setInputUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageList, setMessageList] = useState([]);
  
  const {
    isConnected,
    messages,
    userId,
    startConnection,
    stopConnection,
    registerUser,
    sendMessage,
    clearMessages
  } = useSignalR('https://localhost:7161/notificationhub');

  const handleConnect = async () => {
    if (!inputUserId.trim()) {
      alert('Please enter a User ID');
      return;
    }
    
    try {
      await startConnection();
      // Add a small delay to ensure connection is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      await registerUser(inputUserId);
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const handleDisconnect = async () => {
    await stopConnection();
    setInputUserId('');
  };

  const handleSendMessage = async () => {
    if (!targetUserId.trim() || !messageText.trim()) {
      alert('Please enter both target user ID and message');
      return;
    }

    const newMessage = `${new Date().toLocaleTimeString()}: ${messageText}`;
    setMessageList(prev => [...prev, newMessage]);
    
    await sendMessage(targetUserId, [messageText]);
    setMessageText('');
  };

  const handleClearMessages = () => {
    clearMessages();
    setMessageList([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SignalR React Client</h1>
        
        <div className="connection-section">
          <h2>Connection</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your User ID"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              disabled={isConnected}
            />
            <button 
              onClick={handleConnect} 
              disabled={isConnected}
              className="connect-btn"
            >
              Connect
            </button>
            <button 
              onClick={handleDisconnect} 
              disabled={!isConnected}
              className="disconnect-btn"
            >
              Disconnect
            </button>
          </div>
          <div className="status">
            Status: <span className={isConnected ? 'connected' : 'disconnected'}>
              {isConnected ? `Connected as ${userId}` : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="messaging-section">
          <h2>Send Message</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Target User ID"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              disabled={!isConnected}
            />
            <input
              type="text"
              placeholder="Message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!isConnected}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!isConnected}
              className="send-btn"
            >
              Send
            </button>
          </div>
        </div>

        <div className="messages-section">
          <div className="messages-header">
            <h2>Messages</h2>
            <button 
              onClick={handleClearMessages}
              className="clear-btn"
            >
              Clear
            </button>
          </div>
          
          <div className="messages-container">
            <div className="sent-messages">
              <h3>Sent Messages</h3>
              <div className="message-list">
                {messageList.map((msg, index) => (
                  <div key={index} className="message sent">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="received-messages">
              <h3>Received Messages</h3>
              <div className="message-list">
                {messages.map((msg, index) => (
                  <div key={index} className="message received">
                    {new Date().toLocaleTimeString()}: {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
