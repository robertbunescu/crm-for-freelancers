import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        totalLeads: 0,
        activeClients: 0,
        conversionRate: 0,
        monthlyRevenue: 0
      })
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      const [leads, clients, wonLeads] = await Promise.all([
        prisma.lead.count({ where: { userId } }),
        prisma.client.count({ where: { userId } }),
        prisma.lead.findMany({
          where: { userId, status: 'WON' }
        })
      ])

      const totalRevenue = wonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)
      const conversionRate = leads > 0 ? ((wonLeads.length / leads) * 100).toFixed(1) : '0'

      return NextResponse.json({
        totalLeads: leads,
        activeClients: clients,
        conversionRate: parseFloat(conversionRate as string),
        monthlyRevenue: totalRevenue
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        totalLeads: 0,
        activeClients: 0,
        conversionRate: 0,
        monthlyRevenue: 0
      })
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({
      totalLeads: 0,
      activeClients: 0,
      conversionRate: 0,
      monthlyRevenue: 0
    })
  }
}
