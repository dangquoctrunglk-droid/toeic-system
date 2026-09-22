import nodemailer from "nodemailer";

/**
 * Tạo transporter gửi email thông qua SMTP (mặc định hỗ trợ Gmail)
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 465;
  const secure = process.env.EMAIL_SECURE === "true" || port === 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Gửi email chứa mã OTP xác thực đổi mật khẩu
 */
export const sendOtpEmail = async (
  toEmail: string,
  otp: string,
  fullName: string = "Học viên",
): Promise<{ success: boolean; sentByEmail: boolean }> => {
  const transporter = createTransporter();
  const senderEmail = process.env.EMAIL_USER || "support@toeicmaster.com";
  const senderName = process.env.EMAIL_FROM_NAME || "TOEICMaster AI";

  // Luôn ghi log ra console server để phục vụ kiểm thử nhanh
  console.log(`\n======================================================`);
  console.log(`📨 [OTP EMAIL] Gửi mã xác thực cho: ${toEmail}`);
  console.log(`🔑 Mã OTP: ${otp} (Hiệu lực: 10 phút)`);
  console.log(`======================================================\n`);

  if (!transporter) {
    console.warn(
      `⚠️ [EMAIL SERVICE] Chưa cấu hình EMAIL_USER và EMAIL_PASS trong server/.env. Mã OTP chỉ hiển thị ở console và client devOtp!`,
    );
    return { success: true, sentByEmail: false };
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực OTP - TOEICMaster AI</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                  TOEIC<span style="color: #6366f1;">Master</span> <span style="font-size: 11px; background: #312e81; color: #a5b4fc; padding: 3px 7px; border-radius: 6px; border: 1px solid #4338ca; vertical-align: middle; margin-left: 4px;">AI</span>
                </h1>
                <p style="margin: 6px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">ETS PREP PLATFORM</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #ffffff;">Yêu cầu đặt lại mật khẩu</h2>
                <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  Xin chào <strong>${fullName}</strong>,<br>
                  Bạn vừa gửi yêu cầu lấy lại mật khẩu trên hệ thống luyện thi <strong>TOEICMaster AI</strong>. Dưới đây là mã xác thực OTP của bạn:
                </p>
                
                <!-- OTP Box -->
                <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #4f46e5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #818cf8; margin-bottom: 8px; font-weight: 600;">Mã xác thực một lần (OTP)</div>
                  <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${otp}</div>
                  <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Hiệu lực trong <strong style="color: #f59e0b;">10 phút</strong></div>
                </div>

                <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                  🔒 <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc đổi mật khẩu để bảo vệ tài khoản.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
                © 2026 TOEICMaster AI System. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: toEmail,
      subject: `[TOEICMaster] Mã xác thực OTP đặt lại mật khẩu: ${otp}`,
      text: `Mã xác thực OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút. Tuyệt đối không chia sẻ mã này cho người khác.`,
      html: htmlContent,
    });
    console.log(`✅ [EMAIL SERVICE] Đã gửi email OTP thành công tới: ${toEmail}`);
    return { success: true, sentByEmail: true };
  } catch (error) {
    console.error(`❌ [EMAIL SERVICE] Lỗi khi gửi email qua SMTP:`, error);
    // Vẫn không làm crash ứng dụng, giữ fallback
    return { success: false, sentByEmail: false };
  }
};
