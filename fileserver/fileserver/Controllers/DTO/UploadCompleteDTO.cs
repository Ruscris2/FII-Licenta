﻿using System.Collections.Generic;

namespace fileserver.Controllers.DTO
{
    public class UploadedFileInfo
    {
        public string filename;
        public string filepath;
    }

    public class UploadCompleteDTO
    {
        public string username;
        public List<UploadedFileInfo> files;
    }
}
