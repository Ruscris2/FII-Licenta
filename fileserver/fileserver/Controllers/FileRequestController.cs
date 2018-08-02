using System;
using Microsoft.AspNetCore.Mvc;

namespace fileserver.Controllers
{
    [Route("filerequest")]
    public class FileRequestController : Controller
    {
        [HttpGet]
        public IActionResult RetriveFile(string filename)
        {
            try
            {
                Byte[] data = System.IO.File.ReadAllBytes("data/" + filename);
                return File(data, "image/png");
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }
    }
}
