import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <Link href="/calendar" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Calendar
              </Link>
              <Link href="/pricing" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Pricing
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Full Name:</strong> {profile?.full_name || 'Not set'}</p>
              <p><strong>Subscription:</strong> {profile?.subscription_tier || 'free'}</p>
              <p><strong>Status:</strong> {profile?.subscription_status || 'free'}</p>
            </div>
            {profile?.subscription_tier === 'free' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  Upgrade to unlock unlimited calendar events and premium features.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Plans
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Calendar Events</h3>
            <p className="text-gray-600">Your calendar events will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
