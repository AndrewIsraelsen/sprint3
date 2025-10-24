export type CalendarEvent = {
  id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  email?: string
  full_name?: string
  stripe_customer_id?: string
  subscription_status: 'free' | 'active' | 'canceled' | 'past_due'
  subscription_tier: 'free' | 'basic' | 'premium'
  created_at: string
  updated_at: string
}
