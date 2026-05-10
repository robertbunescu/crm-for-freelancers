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
