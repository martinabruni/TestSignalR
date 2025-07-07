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

        public Task<Dictionary<string, string>> GetRegisteredUsers()
        {
            return Task.FromResult(_userConnections.ToDictionary(kvp => kvp.Key, kvp => kvp.Value));
        }

        public Task<int> GetRegisteredUsersCount()
        {
            return Task.FromResult(_userConnections.Count);
        }

        public static string? GetConnectionId(string userId)
        {
            _userConnections.TryGetValue(userId, out var connId);
            return connId;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Remove user from connections when they disconnect
            var userToRemove = _userConnections.FirstOrDefault(kvp => kvp.Value == Context.ConnectionId);
            if (!userToRemove.Equals(default(KeyValuePair<string, string>)))
            {
                _userConnections.TryRemove(userToRemove.Key, out _);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
