'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Star,
  Eye,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Home,
  Activity,
  Zap,
  Award
} from 'lucide-react'

interface AnalyticsData {
  totalInquiries: number
  newInquiries: number
  responseRate: number
  conversionRate: number
  avgResponseTime: number
  totalRevenue: number
  topProperties: any[]
  inquiryTrends: any[]
  recentActivity: any[]
}

export default function AgentAnalytics() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30') // days
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/agent-login')
        return
      }
      setUser(user)
    }
    checkAuth()
  }, [supabase, router])

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeframe])

  const fetchAnalytics = async () => {
    try {
      // Fetch comprehensive analytics data
      const [inquiriesResponse, propertiesResponse] = await Promise.all([
        fetch(`/api/analytics/inquiries?timeframe=${timeframe}`),
        fetch(`/api/analytics/properties?timeframe=${timeframe}`)
      ])

      const inquiriesData = await inquiriesResponse.json()
      const propertiesData = await propertiesResponse.json()

      // Mock data for demonstration (replace with real API data)
      setAnalytics({
        totalInquiries: 47,
        newInquiries: 12,
        responseRate: 94,
        conversionRate: 23,
        avgResponseTime: 2.4,
        totalRevenue: 2850000,
        topProperties: [
          { id: '1', title: 'Luxury Villa Georgetown', inquiries: 15, conversions: 3, revenue: 850000 },
          { id: '2', title: 'Modern Apartment New Amsterdam', inquiries: 12, conversions: 2, revenue: 450000 },
          { id: '3', title: 'Beachfront Resort Anna Regina', inquiries: 8, conversions: 1, revenue: 1200000 }
        ],
        inquiryTrends: [
          { date: '2025-01-01', inquiries: 5, responses: 5, conversions: 1 },
          { date: '2025-01-02', inquiries: 8, responses: 7, conversions: 2 },
          { date: '2025-01-03', inquiries: 3, responses: 3, conversions: 0 },
          { date: '2025-01-04', inquiries: 12, responses: 11, conversions: 3 },
          { date: '2025-01-05', inquiries: 6, responses: 6, conversions: 1 }
        ],
        recentActivity: [
          { type: 'inquiry', message: 'New inquiry from John Doe', time: '2 minutes ago', status: 'new' },
          { type: 'conversion', message: 'Sarah Smith converted to sale', time: '1 hour ago', status: 'success' },
          { type: 'response', message: 'Responded to Mike Johnson', time: '3 hours ago', status: 'completed' },
          { type: 'viewing', message: 'Viewing scheduled with Emma Brown', time: '5 hours ago', status: 'scheduled' }
        ]
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, format = 'number' }: any) => {
    const isPositive = change >= 0
    const formattedValue = format === 'currency' 
      ? `GYD ${value.toLocaleString()}`
      : format === 'percentage'
      ? `${value}%`
      : format === 'time'
      ? `${value}h`
      : value.toLocaleString()

    return (
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
          </div>
          <Icon className="h-8 w-8 text-green-600" />
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Performance insights and trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <Link 
                href="/agent/home"
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Inquiries"
            value={analytics?.totalInquiries || 0}
            change={15}
            icon={MessageSquare}
          />
          <StatCard
            title="Response Rate"
            value={analytics?.responseRate || 0}
            change={5}
            icon={Zap}
            format="percentage"
          />
          <StatCard
            title="Conversion Rate"
            value={analytics?.conversionRate || 0}
            change={8}
            icon={Target}
            format="percentage"
          />
          <StatCard
            title="Total Revenue"
            value={analytics?.totalRevenue || 0}
            change={22}
            icon={DollarSign}
            format="currency"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Avg Response Time"
            value={analytics?.avgResponseTime || 0}
            change={-12}
            icon={Clock}
            format="time"
          />
          <StatCard
            title="New Inquiries"
            value={analytics?.newInquiries || 0}
            change={18}
            icon={Mail}
          />
          <StatCard
            title="Property Views"
            value={1247}
            change={25}
            icon={Eye}
          />
          <StatCard
            title="Customer Rating"
            value={4.8}
            change={3}
            icon={Star}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inquiry Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Inquiry Trends</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {analytics?.inquiryTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{new Date(trend.date).toLocaleDateString()}</span>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-blue-600">{trend.inquiries} inquiries</span>
                    <span className="text-green-600">{trend.responses} responses</span>
                    <span className="text-purple-600">{trend.conversions} conversions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Properties */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Properties</h3>
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {analytics?.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600">{property.inquiries} inquiries • {property.conversions} conversions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">GYD {property.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'new' ? 'bg-blue-500' :
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'completed' ? 'bg-gray-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    activity.status === 'success' ? 'bg-green-100 text-green-800' :
                    activity.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎯 Performance Insights</h3>
              <ul className="space-y-1 text-green-100">
                <li>• Your response rate is 25% above average</li>
                <li>• Peak inquiry time: 2-4 PM weekdays</li>
                <li>• Properties with virtual tours convert 40% better</li>
                <li>• Follow-up within 1 hour increases conversions by 7x</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">A+</div>
              <div className="text-green-100">Performance Grade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
