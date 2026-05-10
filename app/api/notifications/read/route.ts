import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, notificationId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      })
    } else {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark notifications as read:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
