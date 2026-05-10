import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Create or get workspace
      let workspace = await prisma.workspace.findFirst({
        where: { ownerId: userId }
      })

      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: {
            name: 'Nexus Studio',
            slug: 'nexus-studio',
            currency: 'USD',
            industry: 'Design',
            ownerId: userId,
          }
        })
      }

      // Add user as owner
      const membership = await prisma.membership.upsert({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId: workspace.id,
          }
        },
        update: { role: 'Owner' },
        create: {
          userId,
          workspaceId: workspace.id,
          role: 'Owner',
        }
      })

      return NextResponse.json({
        workspace,
        membership,
        message: 'Workspace seeded successfully'
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Database error', details: String(dbError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed workspace' },
      { status: 500 }
    )
  }
}
