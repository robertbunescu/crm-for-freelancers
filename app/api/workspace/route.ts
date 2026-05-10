import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(null)
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      const workspace = await prisma.workspace.findFirst({
        where: { ownerId: userId }
      })

      return NextResponse.json(workspace)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error('Failed to fetch workspace:', error)
    return NextResponse.json(null)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workspaceId, name, slug, currency, industry } = body

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      )
    }

    const { prisma } = await import('@/lib/prisma')

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(currency && { currency }),
        ...(industry !== undefined && { industry }),
      }
    })

    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Workspace update error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update workspace',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
