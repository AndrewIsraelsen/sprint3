import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('key_indicators')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ indicators: data })
  } catch (error) {
    console.error('Error fetching key indicators:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { event_type, goal_hours, display_order } = body

    if (!event_type) {
      return NextResponse.json(
        { error: 'Missing required field: event_type' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('key_indicators')
      .insert([
        {
          user_id: user.id,
          event_type,
          goal_hours: goal_hours || 1,
          display_order: display_order || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ indicator: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating key indicator:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
