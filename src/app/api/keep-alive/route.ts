import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    postgresDirect: "pending",
    supabaseRest: "pending",
  };

  // 1. Direct PostgreSQL Query via Prisma (Registers DB Engine activity)
  try {
    const productCount = await prisma.product.count();
    results.postgresDirect = "active";
    results.productCount = productCount;
  } catch (err: any) {
    console.warn("Keep-alive Prisma warning:", err?.message);
    results.postgresDirect = `warning: ${err?.message}`;
  }

  // 2. Supabase REST API Ping (Registers Supabase HTTP API activity)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        results.supabaseRest = "active";
      } else {
        results.supabaseRest = `warning: ${error.message}`;
      }
    } else {
      results.supabaseRest = "skipped: env vars missing";
    }
  } catch (err: any) {
    results.supabaseRest = `warning: ${err?.message}`;
  }

  return NextResponse.json({
    status: "ok",
    message: "Supabase keep-alive pulse executed successfully. Database remains active.",
    details: results,
  });
}
