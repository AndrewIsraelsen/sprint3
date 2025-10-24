import { createClient } from './client'
import type { CalendarEvent } from './types'

export async function getCalendarEvents(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }

  return data as CalendarEvent[]
}

export async function getEventsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching calendar events by date range:', error)
    return []
  }

  return data as CalendarEvent[]
}

export async function createCalendarEvent(
  userId: string,
  event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('calendar_events')
    .insert([
      {
        user_id: userId,
        ...event,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function updateCalendarEvent(
  eventId: string,
  updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating calendar event:', error)
    throw error
  }

  return data as CalendarEvent
}

export async function deleteCalendarEvent(eventId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Error deleting calendar event:', error)
    throw error
  }

  return true
}

export async function duplicateCalendarEvent(eventId: string, userId: string) {
  const supabase = createClient()

  // Get the original event
  const { data: originalEvent, error: fetchError } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', userId)
    .single()

  if (fetchError || !originalEvent) {
    console.error('Error fetching event to duplicate:', fetchError)
    throw fetchError
  }

  // Create a new event with the same data (except id, created_at, updated_at)
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([
      {
        user_id: userId,
        title: originalEvent.title,
        description: originalEvent.description,
        start_time: originalEvent.start_time,
        end_time: originalEvent.end_time,
        location: originalEvent.location,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error duplicating calendar event:', error)
    throw error
  }

  return data as CalendarEvent
}
