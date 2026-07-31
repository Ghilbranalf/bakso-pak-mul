import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json().catch(() => ({}));

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate 6-digit OTP Code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP token in Database (with Raw SQL fallback if Prisma Client DLL is locked)
    try {
      if ((prisma as any).otpToken?.create) {
        await (prisma as any).otpToken.create({
          data: {
            email: cleanEmail,
            code: otpCode,
            expiresAt,
          }
        });
      } else {
        const id = `otp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO "OtpToken" ("id", "email", "code", "expiresAt", "createdAt") VALUES ($1, $2, $3, $4, NOW())`,
          id, cleanEmail, otpCode, expiresAt
        );
      }
    } catch (dbErr: any) {
      console.warn("OTP DB Save Fallback:", dbErr.message);
    }

    // Send Email via Nodemailer SMTP
    const mailResult = await sendOtpEmail(cleanEmail, otpCode);

    if (!mailResult.success) {
      return NextResponse.json(
        { error: "Gagal mengirim email OTP. Pastikan email Anda aktif." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Kode OTP 6-digit asli telah dikirim ke inbox email ${cleanEmail}.`,
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim kode OTP.", details: error.message },
      { status: 500 }
    );
  }
}
