import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id: inquiryId } = await params
    const body = await request.json()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      status,
      priority,
      agent_notes,
      agent_response
    } = body

    // Verify the inquiry belongs to the authenticated user
    const { data: inquiry, error: fetchError } = await supabase
      .from('inquiries')
      .select('agent_id')
      .eq('id', inquiryId)
      .single()

    if (fetchError || !inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    if (inquiry.agent_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this inquiry' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (agent_notes !== undefined) updateData.agent_notes = agent_notes
    if (agent_response !== undefined) {
      updateData.agent_response = agent_response
      updateData.responded_at = new Date().toISOString()
    }

    // Update the inquiry
    const { data: updatedInquiry, error: updateError } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', inquiryId)
      .select(`
        *,
        properties (
          title,
          location,
          price,
          price_type,
          image_urls,
          hero_index
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating inquiry:', updateError)
      return NextResponse.json(
        { error: 'Failed to update inquiry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
      message: 'Inquiry updated successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id: inquiryId } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the inquiry belongs to the authenticated user
    const { data: inquiry, error: fetchError } = await supabase
      .from('inquiries')
      .select('agent_id')
      .eq('id', inquiryId)
      .single()

    if (fetchError || !inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    if (inquiry.agent_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this inquiry' },
        { status: 403 }
      )
    }

    // Delete the inquiry
    const { error: deleteError } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', inquiryId)

    if (deleteError) {
      console.error('Error deleting inquiry:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete inquiry' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
