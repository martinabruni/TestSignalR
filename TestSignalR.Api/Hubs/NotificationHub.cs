using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace TestSignalR.Api.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _userConnections = new();

        public Task RegisterUser(string userId)
        {
            Console.WriteLine($"Registering user: {userId} with connection ID: {Context.ConnectionId}");
            _userConnections[userId] = Context.ConnectionId;
            Console.WriteLine($"Total registered users: {_userConnections.Count}");
            Console.WriteLine($"All registered users: {string.Join(", ", _userConnections.Keys)}");
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
                Console.WriteLine($"User {userToRemove.Key} disconnected, removing from registry");
                _userConnections.TryRemove(userToRemove.Key, out _);
                Console.WriteLine($"Total registered users after removal: {_userConnections.Count}");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
