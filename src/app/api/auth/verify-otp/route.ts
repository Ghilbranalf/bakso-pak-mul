import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otpCode, name, phone } = await request.json().catch(() => ({}));

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email dan Kode OTP 6-digit wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    // Verify OTP token against Database records (with Raw SQL fallback)
    let validToken: any = null;

    try {
      if ((prisma as any).otpToken?.findFirst) {
        validToken = await (prisma as any).otpToken.findFirst({
          where: {
            email: cleanEmail,
            code: cleanCode,
            expiresAt: {
              gte: new Date()
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        });
      } else {
        const rows: any = await prisma.$queryRawUnsafe(
          `SELECT * FROM "OtpToken" WHERE "email" = $1 AND "code" = $2 AND "expiresAt" >= NOW() ORDER BY "createdAt" DESC LIMIT 1`,
          cleanEmail, cleanCode
        );
        if (Array.isArray(rows) && rows.length > 0) {
          validToken = rows[0];
        }
      }
    } catch (dbErr: any) {
      console.warn("OTP Verify DB Check Error:", dbErr.message);
    }

    if (!validToken) {
      return NextResponse.json(
        { error: "Kode OTP 6-digit tidak cocok atau telah kedaluwarsa. Silakan periksa inbox/spam email Anda." },
        { status: 400 }
      );
    }

    // Delete used token to prevent replay
    try {
      if ((prisma as any).otpToken?.delete) {
        await (prisma as any).otpToken.delete({ where: { id: validToken.id } }).catch(() => {});
      } else {
        await prisma.$executeRawUnsafe(`DELETE FROM "OtpToken" WHERE "id" = $1`, validToken.id).catch(() => {});
      }
    } catch (delErr) {
      console.warn("Token Delete Warning:", delErr);
    }

    // Upsert User in Database
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      const userId = `usr-${Date.now()}`;
      const defaultName = name || cleanEmail.split("@")[0];
      user = await prisma.user.create({
        data: {
          id: userId,
          email: cleanEmail,
          name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
          role: "USER",
        }
      });
    }

    // Save phone number address if provided
    if (phone && user) {
      const existingAddress = await prisma.userAddress.findFirst({
        where: { userId: user.id }
      });

      if (!existingAddress) {
        await prisma.userAddress.create({
          data: {
            userId: user.id,
            label: "Utama",
            recipientName: name || user.name || "Pelanggan Bakso Pak Mul",
            phone: phone,
            province: "Jawa Tengah",
            city: "Kabupaten Brebes",
            fullAddress: "Alamat Pengiriman",
            isMain: true,
          }
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi OTP Berhasil! Akun Anda telah terverifikasi.",
      user,
    });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi kode OTP.", details: error.message },
      { status: 500 }
    );
  }
}
