using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TestSignalR.Api.Hubs;

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

        //TODO: da autorizzare tramite api key
        [HttpPost]
        public async Task<IActionResult> Post([FromQuery] Guid operationId)
        {
            string userId = "testUser"; //TODO: prendere userId dall'httpcontext

            //TODO: fare una chiamata ad appstream con lo userId
            var response = new
            {
                //RESPONSE: file group e userId
                FileGroup = "testFileGroup",
                UserId = userId
            };

            var connectionId = NotificationHub.GetConnectionId(userId);
            if (connectionId != null)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessages", response.FileGroup);
                return Ok();
            }

            return NotFound("User not connected");
        }
    }
}
