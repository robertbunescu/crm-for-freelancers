import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json([])
    }

    const { prisma } = await import('@/lib/prisma')

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      take: 20
    })

    return NextResponse.json(notifications)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
