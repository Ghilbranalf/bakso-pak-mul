'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  const redirectTo = formData.get('redirectTo') as string
  revalidatePath('/', 'layout')
  if (redirectTo) {
    redirect(redirectTo)
  }
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })

  if (error) {
    console.error("SUPABASE SIGNUP ERROR:", error);
    const errorMessage = typeof error.message === 'string' && error.message.length > 0 
      ? error.message 
      : "Terjadi kesalahan pada server email. Silakan coba gunakan email lain atau hubungi admin.";
    redirect(`/register?message=${encodeURIComponent(errorMessage)}`)
  }

  // Create user in Prisma directly after successful signup
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email || email,
          name: name,
          role: 'USER',
        }
      })
    } catch (e) {
      console.error("Error syncing user to Prisma:", e)
      // Non-fatal, they can still login
    }
  }

  revalidatePath('/', 'layout')
  
  // Jika "Confirm Email" di Supabase dimatikan, session akan langsung terbuat
  if (data.session) {
    redirect('/')
  } else {
    redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
  }
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })
  
  if (data.url) {
    redirect(data.url)
  }
  
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }
}

export async function verifyOtpAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })

  if (error) {
    redirect(`/verify-otp?email=${encodeURIComponent(email)}&message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
