using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace TestSignalR.Api.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _userConnections = new();

        public Task RegisterUser(string userId)
        {
            _userConnections[userId] = Context.ConnectionId;
            return Task.CompletedTask;
        }

        public static string GetConnectionId(string userId)
        {
            _userConnections.TryGetValue(userId, out var connId);
            return connId;
        }
    }
}
