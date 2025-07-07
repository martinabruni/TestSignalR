import { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const useSignalR = (hubUrl) => {
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    const connectionRef = useRef(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                withCredentials: false,
                skipNegotiation: false,
                transport: 1 // WebSockets
            })
            .configureLogging(LogLevel.Information)
            .build();

        connectionRef.current = newConnection;
        setConnection(newConnection);

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [hubUrl]);

    const startConnection = async () => {
        if (connection) {
            try {
                console.log('Starting SignalR connection...');
                await connection.start();
                setIsConnected(true);
                console.log('SignalR Connected successfully');
                console.log('Connection state:', connection.state);
                console.log('Connection ID:', connection.connectionId);

                // Listen for incoming messages
                connection.on('ReceiveMessages', (messageData) => {
                    console.log('Received messages:', messageData);
                    setMessages(prev => [...prev, ...messageData]);
                });

            } catch (error) {
                console.error('SignalR Connection Error:', error);
                setIsConnected(false);
            }
        }
    };

    const stopConnection = async () => {
        if (connection) {
            try {
                await connection.stop();
                setIsConnected(false);
                console.log('SignalR Disconnected');
            } catch (error) {
                console.error('SignalR Disconnection Error:', error);
            }
        }
    };

    const registerUser = async (userId) => {
        console.log('Attempting to register user:', userId);
        console.log('Connection state:', connection?.state);
        console.log('Is connected:', isConnected);
        
        if (connection && connection.state === 'Connected') {
            try {
                console.log('Invoking RegisterUser method...');
                await connection.invoke('RegisterUser', userId);
                setUserId(userId);
                console.log(`User ${userId} registered successfully`);
                
                // Test the connection by trying to get registered users
                try {
                    const registeredUsers = await connection.invoke('GetRegisteredUsers');
                    console.log('Currently registered users:', registeredUsers);
                } catch (testError) {
                    console.log('Could not get registered users (method might not exist):', testError.message);
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        } else {
            console.error('Cannot register user - connection not ready');
            console.log('Connection state:', connection?.state);
        }
    };

    const sendMessage = async (userId, data) => {
        console.log('Sending message to user:', userId, 'with data:', data);
        try {
            const response = await fetch('https://localhost:7161/api/Notification/Post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    data: data
                })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                console.log('Message sent successfully');
            } else {
                const errorText = await response.text();
                console.error('Failed to send message:', errorText);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return {
        connection,
        isConnected,
        messages,
        userId,
        startConnection,
        stopConnection,
        registerUser,
        sendMessage,
        clearMessages: () => setMessages([])
    };
};

export default useSignalR;
