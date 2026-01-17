// Modern Agent Dashboard - Enterprise Analytics & Management
// src/app/dashboard/modern-page.tsx

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserWithRole } from '@/lib/supabaseServer'
import { PropertyStats } from '@/components/PropertyStats'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  CheckCircle, 
  Eye, 
  Phone, 
  Home, 
  Users, 
  TrendingUp,
  Settings
} from 'lucide-react'

// Mock data - replace with real data from your API
const mockAgentStats = {
  views: 1247,
  viewsChange: 12.5,
  inquiries: 23,
  inquiriesChange: 8.3,
  favorites: 45,
  favoritesChange: -2.1,
  averagePrice: 285000,
  priceChange: 5.7,
  totalListings: 12,
  listingsChange: 16.7,
  activeAgents: 1,
  agentsChange: 0,
  averageDaysOnMarket: 28,
  daysChange: -12.5,
  conversionRate: 18.5,
  conversionChange: 3.2,
}

const mockDashboardStats = {
  views: 15847,
  viewsChange: 15.3,
  inquiries: 342,
  inquiriesChange: 12.7,
  favorites: 678,
  favoritesChange: 8.9,
  averagePrice: 320000,
  priceChange: 4.2,
  totalListings: 156,
  listingsChange: 23.1,
  activeAgents: 24,
  agentsChange: 12.5,
  averageDaysOnMarket: 35,
  daysChange: -8.7,
  conversionRate: 22.3,
  conversionChange: 5.4,
}

export default async function ModernDashboard() {
  const { user, role } = await getUserWithRole()

  /* 1️⃣ Bounce unauthenticated users */
  if (!user) redirect('/signin')

  /* 2️⃣ Show upgrade notice for guests */
  if (role === 'guest') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Your account needs to be upgraded to access the full dashboard features.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full sm:w-auto">
                <a href="/advertise#agents">
                  Become an Agent
                </a>
              </Button>
              <p className="text-sm text-gray-500">
                Or contact support for assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* 3️⃣ Main Dashboard for Agents, Admins, and Supers */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {role === 'agent' ? 'Agent' : role === 'admin' ? 'Admin' : 'Super Admin'} Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's what's happening with your properties.
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex space-x-3">
            {/* Agent Actions */}
            {(role === 'agent' || role === 'admin' || role === 'super') && (
              <Button asChild>
                <Link href="/dashboard/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Listing
                </Link>
              </Button>
            )}
            
            {/* Admin Actions */}
            {(role === 'admin' || role === 'super') && (
              <Button asChild variant="outline">
                <Link href="/dashboard/pending" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Listings
                </Link>
              </Button>
            )}
            
            <Button asChild variant="ghost">
              <Link href="/dashboard/settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          {role === 'agent' ? (
            <PropertyStats 
              variant="agent" 
              stats={mockAgentStats}
              className="mb-8"
            />
          ) : (
            <PropertyStats 
              variant="dashboard" 
              stats={mockDashboardStats}
              className="mb-8"
            />
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* My Listings */}
          <Link href="/dashboard/listings" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-green-300">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                    My Listings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your property listings
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Inquiries */}
          <Link href="/dashboard/inquiries" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-blue-300">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                    Inquiries
                  </h3>
                  <p className="text-sm text-gray-600">
                    Respond to property inquiries
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/dashboard/analytics" className="group">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-purple-300">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    View detailed performance metrics
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Your property "Modern Villa in Georgetown" received 12 new views</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="p-2 bg-blue-100 rounded-full">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">New inquiry for "Luxury Apartment in New Amsterdam"</p>
                <p className="text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="p-2 bg-purple-100 rounded-full">
                <Plus className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Property "Commercial Space in Linden" was approved</p>
                <p className="text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
