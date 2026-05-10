import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(null)
    }

    const { prisma } = await import('@/lib/prisma')

    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId }
    })

    return NextResponse.json(prefs)
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    return NextResponse.json(null)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, emailWeeklyDigest, emailMentions, emailDealChanges, inappActivityFeed, inappTaskReminders } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        emailWeeklyDigest: emailWeeklyDigest ?? true,
        emailMentions: emailMentions ?? true,
        emailDealChanges: emailDealChanges ?? false,
        inappActivityFeed: inappActivityFeed ?? true,
        inappTaskReminders: inappTaskReminders ?? true,
      },
      create: {
        userId,
        emailWeeklyDigest: emailWeeklyDigest ?? true,
        emailMentions: emailMentions ?? true,
        emailDealChanges: emailDealChanges ?? false,
        inappActivityFeed: inappActivityFeed ?? true,
        inappTaskReminders: inappTaskReminders ?? true,
      }
    })

    return NextResponse.json(prefs)
  } catch (error) {
    console.error('Failed to save preferences:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
