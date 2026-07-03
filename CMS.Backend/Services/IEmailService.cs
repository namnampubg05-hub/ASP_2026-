namespace CMS.Backend.Services
{
    public record EmailOrderItem
    {
        public required string ProductName { get; init; }
        public int Quantity { get; init; }
        public decimal UnitPrice { get; init; }
    }

    public record EmailOrder
    {
        public int Id { get; init; }
        public DateTime OrderDate { get; init; }
        public required string CustomerName { get; init; }
        public required string ShippingAddress { get; init; }
        public required string PaymentMethod { get; init; }
        public required List<EmailOrderItem> Items { get; init; }
        public string? Notes { get; init; }
    }

    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(string toEmail, EmailOrder order);
        Task SendOrderStatusUpdateAsync(string toEmail, string customerName, int orderId, int status, string? notes);
        Task SendPasswordResetAsync(string toEmail, string customerName, string resetLink);
    }
}
