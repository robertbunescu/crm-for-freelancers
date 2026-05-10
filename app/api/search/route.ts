import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')
    const userId = req.nextUrl.searchParams.get('userId')

    if (!q || !userId) {
      return NextResponse.json([])
    }

    const { prisma } = await import('@/lib/prisma')
    const query = q.toLowerCase()

    const [leads, clients, tasks] = await Promise.all([
      prisma.lead.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, company: true },
        take: 5,
      }),
      prisma.client.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true },
        take: 5,
      }).catch(() => []),
      prisma.task.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, description: true },
        take: 5,
      }).catch(() => []),
    ])

    const results = [
      ...leads.map(l => ({
        id: l.id,
        type: 'lead' as const,
        name: l.name,
        description: l.company || undefined,
      })),
      ...clients.map(c => ({
        id: c.id,
        type: 'client' as const,
        name: c.name,
        description: c.email || undefined,
      })),
      ...tasks.map(t => ({
        id: t.id,
        type: 'task' as const,
        name: t.title,
        description: t.description || undefined,
      })),
    ].slice(0, 10)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json([])
  }
}
