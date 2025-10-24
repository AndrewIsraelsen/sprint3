import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to calendar
  if (user) {
    redirect('/calendar')
  }

  // If not authenticated, redirect to login
  redirect('/login')
}
