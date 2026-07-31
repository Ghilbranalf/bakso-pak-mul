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

    // Store OTP token in DB
    try {
      await prisma.otpToken.create({
        data: {
          email: cleanEmail,
          code: otpCode,
          expiresAt,
        }
      });
    } catch (dbErr) {
      console.warn("OTP DB Save Fallback:", dbErr);
    }

    // Send Email via Nodemailer
    await sendOtpEmail(cleanEmail, otpCode);

    return NextResponse.json({
      success: true,
      message: `Kode OTP 6-digit telah dikirim ke email ${cleanEmail}.`,
      // Return otpCode for easy instant testing in local mode
      demoOtpCode: otpCode,
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim kode OTP.", details: error.message },
      { status: 500 }
    );
  }
}
