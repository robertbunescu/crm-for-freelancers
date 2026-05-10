import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const workspaceId = req.nextUrl.searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json([])
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      const members = await prisma.membership.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      return NextResponse.json(members)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Failed to fetch workspace members:', error)
    return NextResponse.json([])
  }
}
