using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace CMS.Backend.Services
{
    public class EmailSettings
    {
        public string SendGridApiKey { get; set; } = "";
        public string SenderName { get; set; } = "";
        public string SenderEmail { get; set; } = "";
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendOrderConfirmationAsync(string toEmail, EmailOrder order)
        {
            if (string.IsNullOrEmpty(toEmail)) return;

            var total = order.Items.Sum(od => od.Quantity * od.UnitPrice);

            var itemsHtml = string.Join("", order.Items.Select(od => $@"
            <tr>
                <td style='padding: 8px; border: 1px solid #ddd;'>{od.ProductName}</td>
                <td style='padding: 8px; border: 1px solid #ddd; text-align: center;'>{od.Quantity}</td>
                <td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>{od.UnitPrice:#,##0} đ</td>
                <td style='padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;'>{(od.Quantity * od.UnitPrice):#,##0} đ</td>
            </tr>"));

            var body = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: Arial, sans-serif; padding: 20px;'>
    <h2 style='color: #0d6efd;'>Xác nhận đơn hàng #{order.Id}</h2>
    <p>Xin chào <strong>{order.CustomerName}</strong>,</p>
    <p>Cảm ơn bạn đã đặt hàng tại <strong>NAMCMS</strong>. Đơn hàng của bạn đã được ghi nhận và đang chờ xác nhận.</p>
    <h3 style='margin-top: 20px;'>Thông tin đơn hàng</h3>
    <table style='width: 100%; border-collapse: collapse;'>
        <tr><td style='padding: 4px 0;'><strong>Mã đơn hàng:</strong></td><td>#{order.Id}</td></tr>
        <tr><td style='padding: 4px 0;'><strong>Ngày đặt:</strong></td><td>{order.OrderDate:dd/MM/yyyy HH:mm}</td></tr>
        <tr><td style='padding: 4px 0;'><strong>Phương thức thanh toán:</strong></td><td>{PaymentLabel(order.PaymentMethod)}</td></tr>
        <tr><td style='padding: 4px 0;'><strong>Địa chỉ giao hàng:</strong></td><td>{order.ShippingAddress}</td></tr>
    </table>
    <h3 style='margin-top: 20px;'>Chi tiết sản phẩm</h3>
    <table style='width: 100%; border-collapse: collapse; border: 1px solid #ddd;'>
        <thead>
            <tr style='background: #f8f9fa;'>
                <th style='padding: 8px; border: 1px solid #ddd; text-align: left;'>Sản phẩm</th>
                <th style='padding: 8px; border: 1px solid #ddd; text-align: center;'>Số lượng</th>
                <th style='padding: 8px; border: 1px solid #ddd; text-align: right;'>Đơn giá</th>
                <th style='padding: 8px; border: 1px solid #ddd; text-align: right;'>Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            {itemsHtml}
        </tbody>
        <tfoot>
            <tr>
                <td colspan='3' style='padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;'>Tổng cộng:</td>
                <td style='padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #dc3545;'>{total:#,##0} đ</td>
            </tr>
        </tfoot>
    </table>
    <p style='margin-top: 20px; color: #6c757d;'>Chúng tôi sẽ thông báo khi đơn hàng được xác nhận.</p>
    <p>Trân trọng,<br><strong>NAMCMS</strong></p>
</body>
</html>";

            await SendEmailAsync(toEmail, $"Xác nhận đơn hàng #{order.Id} - NAMCMS", body);
        }

        public async Task SendOrderStatusUpdateAsync(string toEmail, string customerName, int orderId, int status, string? notes)
        {
            if (string.IsNullOrEmpty(toEmail)) return;

            var statusText = status switch
            {
                1 => "đã được xác nhận và đang được giao",
                2 => "đã giao hàng thành công",
                3 => "đã bị hủy",
                _ => "đã được cập nhật"
            };

            var body = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: Arial, sans-serif; padding: 20px;'>
    <h2 style='color: #0d6efd;'>Cập nhật đơn hàng #{orderId}</h2>
    <p>Xin chào <strong>{customerName}</strong>,</p>
    <p>Đơn hàng <strong>#{orderId}</strong> của bạn {statusText}.</p>
    {(!string.IsNullOrEmpty(notes) ? $"<p><strong>Ghi chú:</strong> {notes}</p>" : "")}
    <p style='margin-top: 20px;'>Cảm ơn bạn đã mua sắm tại NAMCMS!</p>
    <p>Trân trọng,<br><strong>NAMCMS</strong></p>
</body>
</html>";

            await SendEmailAsync(toEmail, $"Cập nhật đơn hàng #{orderId} - NAMCMS", body);
        }

        public async Task SendPasswordResetAsync(string toEmail, string customerName, string resetLink)
        {
            if (string.IsNullOrEmpty(toEmail)) return;

            var body = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family: Arial, sans-serif; padding: 20px;'>
    <h2 style='color: #0d6efd;'>Đặt lại mật khẩu</h2>
    <p>Xin chào <strong>{customerName}</strong>,</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>NAMCMS</strong>.</p>
    <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu (liên kết có hiệu lực trong 24 giờ):</p>
    <p style='text-align: center; margin: 30px 0;'>
        <a href='{resetLink}' style='background: #0d6efd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Đặt lại mật khẩu</a>
    </p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p>Trân trọng,<br><strong>NAMCMS</strong></p>
</body>
</html>";

            await SendEmailAsync(toEmail, "Đặt lại mật khẩu - NAMCMS", body);
        }

        private async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var client = new SendGridClient(_settings.SendGridApiKey);
            var from = new EmailAddress(_settings.SenderEmail, _settings.SenderName);
            var toAddr = new EmailAddress(to);
            var msg = MailHelper.CreateSingleEmail(from, toAddr, subject, null, htmlBody);
            await client.SendEmailAsync(msg);
        }

        private static string PaymentLabel(string? method) => (method ?? "").ToLower() switch
        {
            "cod" => "COD (Thanh toán khi nhận hàng)",
            "bank_transfer" => "Chuyển khoản ngân hàng",
            "momo" => "Ví MoMo",
            _ => method ?? ""
        };
    }
}
