import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json().catch(() => ({}));

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan Password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find User in Database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // Verify Password if user has a hashed password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Email atau password yang Anda masukkan salah." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Login Berhasil!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan proses login.", details: error.message },
      { status: 500 }
    );
  }
}
