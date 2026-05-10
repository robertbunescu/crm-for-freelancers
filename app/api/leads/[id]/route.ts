import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  PROPOSAL: 'Proposal',
  WON: 'Won',
  LOST: 'Lost',
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email !== undefined && { email: body.email || null }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.company !== undefined && { company: body.company || null }),
        ...(body.status && { status: body.status }),
        ...(body.value !== undefined && { value: parseFloat(body.value) || 0 }),
        ...(body.source !== undefined && { source: body.source || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      },
    })

    try {
      const userId = body.userId || existing.userId
      const prefs = await prisma.notificationPreference.findUnique({ where: { userId } })
      if (!prefs || prefs.inappActivityFeed) {
        const statusChanged = body.status && body.status !== existing.status
        const title = statusChanged
          ? `Lead moved to ${STATUS_LABELS[body.status] ?? body.status}`
          : 'Lead updated'
        const message = statusChanged
          ? `${lead.name}${lead.company ? ` from ${lead.company}` : ''} is now ${STATUS_LABELS[body.status] ?? body.status}.`
          : `${lead.name}${lead.company ? ` from ${lead.company}` : ''} was updated.`
        await prisma.notification.create({
          data: { userId, type: 'lead_updated', title, message, resourceType: 'lead', resourceId: lead.id },
        })
      }
    } catch {}

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Failed to update lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    const userId = req.nextUrl.searchParams.get('userId')

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.lead.delete({ where: { id } })

    try {
      const uid = userId || existing.userId
      const prefs = await prisma.notificationPreference.findUnique({ where: { userId: uid } })
      if (!prefs || prefs.inappActivityFeed) {
        await prisma.notification.create({
          data: {
            userId: uid,
            type: 'lead_deleted',
            title: 'Lead removed',
            message: `${existing.name}${existing.company ? ` from ${existing.company}` : ''} was removed from your pipeline.`,
            resourceType: 'lead',
            resourceId: id,
          },
        })
      }
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
