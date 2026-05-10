import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, currentPassword, newPassword } = body

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { createClient } = await import('@supabase/supabase-js')

    // Create a client with the user's credentials to verify password
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const { prisma } = await import('@/lib/prisma')

    // Get user email from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create a temporary Supabase client to verify the current password
    const tempClient = createClient(supabaseUrl, supabaseAnonKey)

    const { error: signInError, data: signInData } = await tempClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError || !signInData.session) {
      return NextResponse.json(
        {
          error: 'Invalid current password',
          details: 'Current password is incorrect'
        },
        { status: 401 }
      )
    }

    // Set session on the client, then update password
    await tempClient.auth.setSession({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    })

    const { error: updateError } = await tempClient.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return NextResponse.json(
        {
          error: 'Failed to update password',
          details: updateError.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update password',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
