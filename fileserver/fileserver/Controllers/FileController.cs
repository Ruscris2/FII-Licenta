
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using fileserver.Controllers.DTO;
using fileserver.Logic;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Transforms;

namespace fileserver.Controllers
{
    [Route("file")]
    public class FileController : Controller
    {
        [HttpGet]
        public IActionResult UploadRequest()
        {
            // TODO: This method is not secure, user can bypass API
            // Generate a request key, register it and send it back to the API
            string keyPlainText = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();

            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();

            byte[] inputBytes = Encoding.ASCII.GetBytes(keyPlainText);
            byte[] outputBytes = md5.ComputeHash(inputBytes);

            StringBuilder keyHash = new StringBuilder();
            for (int i = 0; i < outputBytes.Length; i++)
                    keyHash.Append(outputBytes[i].ToString("X2"));

            RequestManager.GetInstance().RegisterRequestKey(keyHash.ToString());

            return Ok(new {key = keyHash.ToString()});
        }

        [HttpPost]
        public IActionResult FileDataReceived([FromBody] FileDataDTO dto)
        {
            UploadCompleteDTO responseDto = new UploadCompleteDTO();
            responseDto.username = dto.user;
            responseDto.files = new List<UploadedFileInfo>();

            if (!RequestManager.GetInstance().ConsumeRequestKey(dto.key))
                return BadRequest();

            string directory = Path.GetDirectoryName("data/" + dto.user + "/");
            string thumbDir = Path.GetDirectoryName("data/" + dto.user + "/thumbs/");

            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);
            if (!Directory.Exists(thumbDir))
                Directory.CreateDirectory(thumbDir);

            for (int i = 0; i < dto.files.Count; i++)
            {
                byte[] data = Convert.FromBase64String(dto.files[i].data);

                // Create a random hash that acts as filename (using time + random to ensure no duplicate names)
                string namePlainText = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString() +
                                      (new Random()).Next().ToString();

                System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();

                byte[] inputBytes = Encoding.ASCII.GetBytes(namePlainText);
                byte[] outputBytes = md5.ComputeHash(inputBytes);

                StringBuilder nameHash = new StringBuilder();
                for (int j = 0; j < outputBytes.Length; j++)
                    nameHash.Append(outputBytes[j].ToString("X2"));

                FileStream fs = System.IO.File.Create("data/" + dto.user + "/" + nameHash + ".png");
                BinaryWriter bw = new BinaryWriter(fs);

                bw.Write(data);

                bw.Close();
                fs.Close();

                // Create a thumbnail image from the original
                FileStream originalImage = System.IO.File.OpenRead("data/" + dto.user + "/" + nameHash + ".png");
                FileStream thumbnailImage = System.IO.File.OpenWrite("data/" + dto.user + "/thumbs/" + nameHash + ".png");

                Image<Rgba32> image = Image.Load(originalImage);

                // Compute width and height factors that result in a under 200px image
                int factor = 1;
                while (((image.Width / factor) > 200) || ((image.Height / factor) > 200))
                    factor *= 2;

                image.Mutate(x => x.Resize(image.Width / factor, image.Height / factor));
                image.Save(thumbnailImage, ImageFormats.Png);

                originalImage.Close();
                thumbnailImage.Close();

                // Add a entry for the response DTO that will be transmited to the API
                UploadedFileInfo fileInfo = new UploadedFileInfo();
                fileInfo.filename = dto.files[i].filename;
                fileInfo.filepath = "http://localhost:5001/filerequest/?filename=" + dto.user + "/" + nameHash + ".png";
                fileInfo.thumbfilepath = "http://localhost:5001/filerequest/?filename=" + dto.user + "/thumbs/" +
                                         nameHash + ".png";
                responseDto.files.Add(fileInfo);
            }

            // Send the response to the API
            RestClient restClient = new RestClient("http://localhost:5000");
            RestRequest restRequest = new RestRequest("upload", Method.POST);
            restRequest.RequestFormat = DataFormat.Json;
            restRequest.AddBody(responseDto);
            restClient.Execute(restRequest);

            return Ok();
        }
    }
}
