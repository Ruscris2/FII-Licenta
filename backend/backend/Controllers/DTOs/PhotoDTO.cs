using System;

namespace backend.Controllers.DTOs
{
    public class PhotoDTO
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public string ServerFilePath { get; set; }
        public string ServerThumbFilePath { get; set; }
        public DateTime TimeAdded { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }
        public int RatingsCount { get; set; }
        public string AuthorUsername { get; set; }
        public string FaceData { get; set; }
        public string FaceTags { get; set; }
    }
}
