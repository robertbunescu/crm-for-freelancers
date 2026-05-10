const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  try {
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nexuscrm.io' }
    })

    if (!adminUser) {
      console.log('Admin user not found. Please log in first.')
      process.exit(1)
    }

    console.log(`Found admin user: ${adminUser.email}`)

    // Create or get workspace
    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: adminUser.id }
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Nexus Studio',
          slug: 'nexus-studio',
          currency: 'USD',
          industry: 'Design',
          ownerId: adminUser.id,
        }
      })
      console.log(`Created workspace: ${workspace.name}`)
    } else {
      console.log(`Workspace already exists: ${workspace.name}`)
    }

    // Add admin as owner
    const adminMembership = await prisma.membership.upsert({
      where: {
        userId_workspaceId: {
          userId: adminUser.id,
          workspaceId: workspace.id,
        }
      },
      update: { role: 'Owner' },
      create: {
        userId: adminUser.id,
        workspaceId: workspace.id,
        role: 'Owner',
      }
    })

    console.log(`Admin is member with role: ${adminMembership.role}`)
    console.log('✅ Workspace seed completed')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
