
using System;
using System.Collections.Generic;

namespace fileserver.Controllers.DTO
{
    public class FileInfo
    {
        public string filename;
        public string data;
    }

    public class FileDataDTO
    {
        public string key;
        public string user;
        public List<FileInfo> files;
    }
}
