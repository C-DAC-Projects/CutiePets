namespace Admin_Backend.Models
{
    public class OtpRequest
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string OtpCode { get; set; }
        public DateTime ExpiryTime { get; set; }
    }

}
