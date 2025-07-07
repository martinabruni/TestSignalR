using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TestSignalR.Api.Hubs;
using TestSignalR.Api.Models;

namespace TestSignalR.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class NotificationController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationController(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Message message)
        {
            var connectionId = NotificationHub.GetConnectionId(message.UserId);
            if (connectionId != null)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessages", message.Data);
                return Ok();
            }

            return NotFound("User not connected");
        }
    }
}
