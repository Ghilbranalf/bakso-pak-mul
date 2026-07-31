import nodemailer from "nodemailer";

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #51000d; font-size: 26px; font-weight: 900; margin: 0;">Bakso Pak Mul</h1>
        <p style="color: #888; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Kode OTP Pendaftaran Akun</p>
      </div>

      <div style="background-color: #fff8f8; border-left: 4px solid #51000d; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">
          Gunakan 6-digit kode verifikasi OTP berikut untuk menyelesaikan pendaftaran akun <strong>Bakso Pak Mul</strong> Anda:
        </p>
      </div>

      <div style="text-align: center; background-color: #51000d; color: #ffffff; padding: 20px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(81,0,13,0.15);">
        <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #fbbf24;">${otpCode}</span>
        <p style="font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 8px; margin-bottom: 0;">Berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.</p>
      </div>

      <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
        Jika Anda tidak merasa mendaftar di Bakso Pak Mul, abaikan email ini.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px 0;" />
      
      <p style="color: #aaa; font-size: 11px; text-align: center; margin: 0;">
        &copy; ${new Date().getFullYear()} Bakso Pak Mul Official Store. All rights reserved.
      </p>
    </div>
  `;

  return sendMailHelper({
    to: toEmail,
    subject: `[Bakso Pak Mul] Kode OTP Pendaftaran Anda: ${otpCode}`,
    html: htmlTemplate,
  });
}

export async function sendOrderInvoiceEmail(order: any) {
  if (!order || !order.customerEmail) return { success: false, error: "No email" };

  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const itemsHtml = (order.items || []).map((it: any) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px dashed #eee; font-size: 13px; font-weight: bold; color: #333;">
        ${it.product?.name || it.name || "Produk Bakso Pak Mul"} x ${it.quantity}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px dashed #eee; font-size: 13px; font-weight: bold; text-align: right; color: #51000d;">
        Rp ${formatPrice((it.priceAtTime || it.price || 0) * it.quantity)}
      </td>
    </tr>
  `).join("");

  const invoiceHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 20px; background-color: #ffffff;">
      <div style="background-color: #51000d; color: #ffffff; padding: 24px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">Bakso Pak Mul</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 2px;">Nota / Struk Pembayaran Lunas</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 13px; color: #444;">
        <p style="margin: 0 0 4px 0;">Kepada Yth: <strong>${order.customerName || "Pelanggan Setia"}</strong></p>
        <p style="margin: 0 0 4px 0;">No. Pesanan: <strong style="font-family: monospace; color: #51000d;">${order.orderNumber}</strong></p>
        <p style="margin: 0 0 4px 0;">Tanggal: <strong>${new Date(order.createdAt || Date.now()).toLocaleDateString("id-ID")}</strong></p>
        <p style="margin: 0;">Status Pembayaran: <span style="background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: 900; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">LUNAS (PAID)</span></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #51000d; text-align: left;">
            <th style="padding-bottom: 8px; font-size: 11px; font-weight: 800; color: #51000d; text-transform: uppercase;">Rincian Produk</th>
            <th style="padding-bottom: 8px; font-size: 11px; font-weight: 800; color: #51000d; text-transform: uppercase; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="background-color: #fcf8f8; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #666;">
          <span>Subtotal Produk:</span>
          <span>Rp ${formatPrice(order.finalTotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #666;">
          <span>Biaya Pengiriman (Gratis Ongkir):</span>
          <span style="color: #059669; font-weight: bold;">Rp 0</span>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;" />
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; color: #51000d;">
          <span>TOTAL PEMBAYARAN:</span>
          <span>Rp ${formatPrice(order.finalTotal)}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: #666; border-left: 3px solid #51000d; padding-left: 12px; margin-bottom: 24px;">
        <p style="margin: 0 0 2px 0; font-weight: bold; color: #333;">Alamat Pengiriman:</p>
        <p style="margin: 0;">${order.address || ""}, ${order.city || ""}, ${order.province || ""}</p>
        <p style="margin: 2px 0 0 0; color: #888;">No. HP: ${order.phone || ""}</p>
      </div>

      <p style="font-size: 12px; text-align: center; color: #888; margin: 0;">
        Terima kasih telah berbelanja di <strong>Bakso Pak Mul</strong>. Pesanan Anda sedang disiapkan dan dikemas dengan higienis.
      </p>
    </div>
  `;

  return sendMailHelper({
    to: order.customerEmail,
    subject: `[Bakso Pak Mul] Invoice Pembayaran Lunas - ${order.orderNumber}`,
    html: invoiceHtml,
  });
}

export async function sendAdminNewOrderNotificationEmail(order: any) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "baksopakmulmantap@gmail.com";
  
  const formatPrice = (price: number) => {
    return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const itemsList = (order.items || [])
    .map((it: any) => `- ${it.name || "Produk"} x ${it.quantity} (Rp ${formatPrice((it.priceAtTime || it.price || 0) * it.quantity)})`)
    .join("\n");

  const waText = encodeURIComponent(
    `Halo ${order.customerName || "Pelanggan"}, pesanan Anda #${order.orderNumber} di Bakso Pak Mul senilai Rp ${formatPrice(order.finalTotal)} telah kami terima dan sedang disiapkan untuk dikirim ke ${order.city || "alamat Anda"}. Terima kasih!`
  );
  const waUrl = `https://wa.me/${(order.phone || "").replace(/\D/g, "")}?text=${waText}`;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #51000d; border-radius: 20px; background-color: #ffffff;">
      <div style="background-color: #51000d; color: #ffffff; padding: 20px; border-radius: 14px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #fbbf24;">🚨 NOTIFIKASI PESANAN BARU LUNAS</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase;">Bakso Pak Mul Admin Alert</p>
      </div>

      <div style="background-color: #fff8f8; border: 1px solid #ffdad8; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #51000d; font-size: 16px; font-weight: 900;">Rincian Pesanan #${order.orderNumber}</h3>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Pelanggan:</strong> ${order.customerName || "Tanpa Nama"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> ${order.customerEmail || "-"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>No. HP / WA:</strong> ${order.phone || "-"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Alamat Pengiriman:</strong> ${order.address || ""}, ${order.district || ""}, ${order.city || ""}, ${order.province || ""}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Total Pembayaran:</strong> <strong style="color: #059669; font-size: 15px;">Rp ${formatPrice(order.finalTotal)} (LUNAS)</strong></p>
      </div>

      <h4 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">Item Produk Dibeli:</h4>
      <pre style="background-color: #f4f4f4; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre-wrap;">${itemsList}</pre>

      <div style="text-align: center; margin-top: 24px; display: flex; gap: 10px; justify-content: center;">
        <a href="https://bakso-pak-mul.vercel.app/admin/orders" style="background-color: #51000d; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 13px;">Buka Dashboard Admin</a>
        ${order.phone ? `<a href="${waUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 13px; margin-left: 8px;">Chat WA Pelanggan</a>` : ''}
      </div>
    </div>
  `;

  return sendMailHelper({
    to: adminEmail,
    subject: `🚨 [PESANAN BARU LUNAS] Order #${order.orderNumber} - Rp ${formatPrice(order.finalTotal)}`,
    html: adminHtml,
  });
}

async function sendMailHelper({ to, subject, html }: { to: string; subject: string; html: string }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass && !smtpPass.includes("demoapppassword")) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Bakso Pak Mul" <${smtpUser}>`,
        to,
        subject,
        html,
      });

      console.log("[NODEMAILER] Email sent successfully to inbox:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn("[NODEMAILER] Custom SMTP failed, switching to Ethereal Mailer:", err.message);
    }
  }

  // Fallback to Ethereal Test Mailer
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"Bakso Pak Mul Official" <no-reply@baksopakmul.com>',
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("[NODEMAILER ETHEREAL] Email sent! View Inbox URL:", previewUrl);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  } catch (etherealErr: any) {
    console.error("[NODEMAILER] Failed to send email:", etherealErr.message);
    return { success: false, error: etherealErr.message };
  }
}
