import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json([])
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      const leads = await prisma.lead.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
      return NextResponse.json(leads)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, email, phone, company, status, value, source, notes } = body

    if (!userId || !name) {
      return NextResponse.json({ error: 'userId and name are required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')

    const lead = await prisma.lead.create({
      data: {
        userId,
        name,
        ...(email && { email }),
        ...(phone && { phone }),
        ...(company && { company }),
        ...(status && { status }),
        ...(value !== undefined && value !== null && { value: parseFloat(value) }),
        ...(source && { source }),
        ...(notes && { notes }),
      }
    })

    // Generate notification if user has inapp activity feed enabled
    try {
      const prefs = await prisma.notificationPreference.findUnique({ where: { userId } })
      if (!prefs || prefs.inappActivityFeed) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'lead_created',
            title: 'New lead added',
            message: `${name}${company ? ` from ${company}` : ''} was added to your pipeline.`,
            resourceType: 'lead',
            resourceId: lead.id,
          }
        })
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Failed to create lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
