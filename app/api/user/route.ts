import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, userId, firstName, lastName, jobTitle, bio, timezone, language, avatar } = body

    // Sync mode - from Supabase auth
    if (email && !userId) {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      try {
        const { prisma } = await import('@/lib/prisma')

        let user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: name || email.split('@')[0],
              password: 'supabase-auth'
            }
          })
        }

        return NextResponse.json(user)
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({
          id: email.split('@')[0],
          email,
          name: name || email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    // Update mode - from Settings page
    if (userId) {
      try {
        const { prisma } = await import('@/lib/prisma')

        const fullName = [firstName, lastName].filter(Boolean).join(' ')

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            ...(fullName && { name: fullName }),
            ...(jobTitle && { jobTitle }),
            ...(bio !== undefined && { bio }),
            ...(timezone && { timezone }),
            ...(language && { language }),
            ...(avatar !== undefined && { avatar }),
          }
        })

        return NextResponse.json(user)
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json(
          {
            error: 'Failed to update user',
            details: dbError instanceof Error ? dbError.message : String(dbError)
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('User error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
