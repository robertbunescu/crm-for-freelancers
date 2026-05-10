import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { error: 'File must be less than 1MB' },
        { status: 400 }
      )
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Ensure bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some((b: any) => b.name === 'avatars')

        if (!bucketExists) {
          await supabase.storage.createBucket('avatars', {
            public: true,
          })
        }
      } catch (bucketError) {
        console.log('Bucket check/create note:', bucketError)
        // Continue anyway - bucket might already exist
      }

      // Convert File to Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Upload to Supabase Storage
      const fileName = `${userId}-${Date.now()}.${file.type.split('/')[1]}`
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const avatarUrl = urlData?.publicUrl

      // Update user in database
      const { prisma } = await import('@/lib/prisma')
      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarUrl }
      })

      return NextResponse.json({
        user,
        avatarUrl,
        message: 'Avatar uploaded successfully'
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save avatar' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}
