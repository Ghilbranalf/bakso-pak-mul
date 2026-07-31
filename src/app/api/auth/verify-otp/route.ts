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

    // Verify OTP token against Database records
    const validToken = await prisma.otpToken.findFirst({
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

    if (!validToken) {
      return NextResponse.json(
        { error: "Kode OTP 6-digit tidak cocok atau telah kedaluwarsa. Silakan periksa inbox/spam email Anda." },
        { status: 400 }
      );
    }

    // Delete used token to prevent replay
    await prisma.otpToken.delete({ where: { id: validToken.id } }).catch(() => {});

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

    // If user provided phone number, save or update main user address / profile info
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
