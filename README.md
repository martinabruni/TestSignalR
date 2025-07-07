# SignalR React Client

A React + Vite application that connects to a SignalR server for real-time messaging.

## Project Structure

- `TestSignalR.Api/` - ASP.NET Core SignalR server
- `client/` - React + Vite client application

## Features

- Real-time messaging using SignalR
- User registration and connection management
- Send and receive messages between users
- Modern React UI with responsive design
- Connection status indicators

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js (v16 or higher)
- npm or yarn

### Running the SignalR Server

1. Navigate to the API directory:

   ```bash
   cd TestSignalR.Api
   ```

2. Run the server:
   ```bash
   dotnet run
   ```

The server will start on `https://localhost:7071` by default.

### Running the React Client

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The client will start on `http://localhost:5173` by default.

## How to Use

1. **Start both servers** - Make sure both the SignalR API and React client are running
2. **Connect a user** - Enter a unique User ID and click "Connect"
3. **Send messages** - Enter a target User ID and message, then click "Send"
4. **Receive messages** - Messages sent to your User ID will appear in the "Received Messages" section

## Testing with Multiple Users

To test real-time messaging:

1. Open multiple browser tabs or windows
2. Connect each tab with a different User ID
3. Send messages between the different users
4. Watch messages appear in real-time in the receiving user's interface

## API Endpoints

- **SignalR Hub**: `https://localhost:7071/notificationhub`
- **Send Message**: `POST https://localhost:7071/api/Notification/Post`

## SignalR Hub Methods

- `RegisterUser(userId)` - Register a user with their connection ID
- `ReceiveMessages(messageData)` - Receive messages from the server

## Architecture

The application uses:

- **ASP.NET Core SignalR** for real-time communication
- **React** with custom hooks for state management
- **Vite** for fast development and building
- **Microsoft SignalR JavaScript client** for browser connectivity

## Troubleshooting

- **CORS Issues**: The API is configured to allow all origins for development
- **Connection Issues**: Make sure both servers are running on the correct ports
- **SSL Certificate**: You may need to accept the self-signed certificate for localhost
- **Port Conflicts**: Update the port numbers in the code if needed

## Development Notes

- The SignalR connection URL is configured in `useSignalR.js`
- The API base URL is configured in the `sendMessage` function
- Connection management is handled through the custom `useSignalR` hook
- User connections are stored in memory on the server (not persistent)
