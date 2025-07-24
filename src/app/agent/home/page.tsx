'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Home, 
  Plus, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  MapPin,
  DollarSign,
  Calendar,
  Star,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react'

export default function AgentDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 12,
    activeListings: 8,
    totalInquiries: 24,
    monthlyViews: 1247,
    avgPrice: 'GYD 28M',
    newInquiries: 5
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Maria Ramdeen</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {stats.newInquiries}
                </span>
              </button>
              <Link 
                href="/agent/home/upload"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href="/agent/home/upload"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Add New Property</span>
                </Link>
                
                <Link
                  href="/agent/properties"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Manage Properties</span>
                </Link>
                
                <Link
                  href="/agent/inquiries"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="text-gray-700">View Inquiries</span>
                  {stats.newInquiries > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {stats.newInquiries}
                    </span>
                  )}
                </Link>
                
                <Link
                  href="/agent/analytics"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">Analytics</span>
                </Link>
                
                <Link
                  href="/agent/profile"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Profile Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Properties & Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
                <Link 
                  href="/agent/properties" 
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Sample recent properties */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img 
                        src="/images/apt-georgetown.jpg" 
                        alt="Property" 
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Georgetown Apartment</p>
                        <p className="text-sm text-gray-600">GYD 120,000/month • 2 bed, 2 bath</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-gray-500">23 views today</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img 
                        src="/images/villa-beachfront.jpg" 
                        alt="Property" 
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Beachfront Villa</p>
                        <p className="text-sm text-gray-600">GYD 48,000,000 • 4 bed, 3 bath</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-gray-500">18 views today</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img 
                        src="/images/house-linden.jpg" 
                        alt="Property" 
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Linden Family Home</p>
                        <p className="text-sm text-gray-600">GYD 25,000,000 • 3 bed, 2 bath</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-gray-500">12 views today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">This Month's Performance</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Avg. Property Value</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgPrice}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Agent Rating</p>
                    <p className="text-xl font-bold text-gray-900">4.8/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
