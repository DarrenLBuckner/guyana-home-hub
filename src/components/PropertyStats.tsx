// Property Analytics Dashboard - Enterprise Stats Component
// src/components/PropertyStats.tsx

import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Phone, 
  Mail,
  Calendar,
  DollarSign,
  Home,
  Users,
  Clock,
  Target
} from 'lucide-react'
import { Property } from '@/types/property'
import { cn } from '@/lib/utils'

interface PropertyStatsProps {
  property?: Property
  stats?: {
    views: number
    viewsChange: number
    inquiries: number
    inquiriesChange: number
    favorites: number
    favoritesChange: number
    averagePrice: number
    priceChange: number
    totalListings: number
    listingsChange: number
    activeAgents: number
    agentsChange: number
    averageDaysOnMarket: number
    daysChange: number
    conversionRate: number
    conversionChange: number
  }
  variant?: 'property' | 'dashboard' | 'agent'
  className?: string
}

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
  suffix?: string
  className?: string
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'neutral',
  suffix = '',
  className 
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return null
    }
  }

  const TrendIcon = getTrendIcon()

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Icon className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="ml-3 text-sm font-medium text-gray-900">{title}</h3>
        </div>
        {change !== undefined && TrendIcon && (
          <div className={cn("flex items-center text-sm", getTrendColor())}>
            <TrendIcon className="h-4 w-4 mr-1" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {suffix && (
          <span className="ml-1 text-sm text-gray-500">{suffix}</span>
        )}
      </div>
      {change !== undefined && (
        <p className={cn("mt-1 text-sm", getTrendColor())}>
          {change > 0 ? '+' : ''}{change}% from last period
        </p>
      )}
    </div>
  )
}

export function PropertyStats({ 
  property, 
  stats, 
  variant = 'dashboard',
  className 
}: PropertyStatsProps) {
  if (variant === 'property' && property) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        <StatCard
          title="Views"
          value={property.metadata.views}
          icon={Eye}
        />
        <StatCard
          title="Inquiries"
          value={property.metadata.inquiries}
          icon={Phone}
        />
        <StatCard
          title="Favorites"
          value={property.metadata.favorites}
          icon={Heart}
        />
        <StatCard
          title="Days Listed"
          value={property.metadata.days_on_market}
          icon={Calendar}
          suffix="days"
        />
      </div>
    )
  }

  if (variant === 'dashboard' && stats) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Views"
              value={stats.views}
              change={stats.viewsChange}
              trend={stats.viewsChange > 0 ? 'up' : stats.viewsChange < 0 ? 'down' : 'neutral'}
              icon={Eye}
            />
            <StatCard
              title="Inquiries"
              value={stats.inquiries}
              change={stats.inquiriesChange}
              trend={stats.inquiriesChange > 0 ? 'up' : stats.inquiriesChange < 0 ? 'down' : 'neutral'}
              icon={Phone}
            />
            <StatCard
              title="Favorites"
              value={stats.favorites}
              change={stats.favoritesChange}
              trend={stats.favoritesChange > 0 ? 'up' : stats.favoritesChange < 0 ? 'down' : 'neutral'}
              icon={Heart}
            />
            <StatCard
              title="Conversion Rate"
              value={stats.conversionRate}
              change={stats.conversionChange}
              trend={stats.conversionChange > 0 ? 'up' : stats.conversionChange < 0 ? 'down' : 'neutral'}
              icon={Target}
              suffix="%"
            />
          </div>
        </div>

        {/* Market Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Average Price"
              value={`$${(stats.averagePrice / 1000).toFixed(0)}K`}
              change={stats.priceChange}
              trend={stats.priceChange > 0 ? 'up' : stats.priceChange < 0 ? 'down' : 'neutral'}
              icon={DollarSign}
            />
            <StatCard
              title="Active Listings"
              value={stats.totalListings}
              change={stats.listingsChange}
              trend={stats.listingsChange > 0 ? 'up' : stats.listingsChange < 0 ? 'down' : 'neutral'}
              icon={Home}
            />
            <StatCard
              title="Active Agents"
              value={stats.activeAgents}
              change={stats.agentsChange}
              trend={stats.agentsChange > 0 ? 'up' : stats.agentsChange < 0 ? 'down' : 'neutral'}
              icon={Users}
            />
            <StatCard
              title="Avg. Days on Market"
              value={stats.averageDaysOnMarket}
              change={stats.daysChange}
              trend={stats.daysChange < 0 ? 'up' : stats.daysChange > 0 ? 'down' : 'neutral'}
              icon={Clock}
              suffix="days"
            />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'agent' && stats) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Agent Performance */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Listings"
              value={stats.totalListings}
              change={stats.listingsChange}
              trend={stats.listingsChange > 0 ? 'up' : stats.listingsChange < 0 ? 'down' : 'neutral'}
              icon={Home}
            />
            <StatCard
              title="Total Inquiries"
              value={stats.inquiries}
              change={stats.inquiriesChange}
              trend={stats.inquiriesChange > 0 ? 'up' : stats.inquiriesChange < 0 ? 'down' : 'neutral'}
              icon={Mail}
            />
            <StatCard
              title="Conversion Rate"
              value={stats.conversionRate}
              change={stats.conversionChange}
              trend={stats.conversionChange > 0 ? 'up' : stats.conversionChange < 0 ? 'down' : 'neutral'}
              icon={Target}
              suffix="%"
            />
          </div>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Property Views"
              value={stats.views}
              change={stats.viewsChange}
              trend={stats.viewsChange > 0 ? 'up' : stats.viewsChange < 0 ? 'down' : 'neutral'}
              icon={Eye}
            />
            <StatCard
              title="Favorites"
              value={stats.favorites}
              change={stats.favoritesChange}
              trend={stats.favoritesChange > 0 ? 'up' : stats.favoritesChange < 0 ? 'down' : 'neutral'}
              icon={Heart}
            />
            <StatCard
              title="Avg. Response Time"
              value={stats.averageDaysOnMarket}
              change={stats.daysChange}
              trend={stats.daysChange < 0 ? 'up' : stats.daysChange > 0 ? 'down' : 'neutral'}
              icon={Clock}
              suffix="hours"
            />
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Quick Stats Component for Property Cards
export function QuickStats({ 
  views, 
  inquiries, 
  favorites,
  className 
}: { 
  views?: number
  inquiries?: number
  favorites?: number
  className?: string 
}) {
  return (
    <div className={cn("flex items-center space-x-4 text-sm text-gray-600", className)}>
      {views !== undefined && (
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>{views}</span>
        </div>
      )}
      {inquiries !== undefined && (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-1" />
          <span>{inquiries}</span>
        </div>
      )}
      {favorites !== undefined && (
        <div className="flex items-center">
          <Heart className="h-4 w-4 mr-1" />
          <span>{favorites}</span>
        </div>
      )}
    </div>
  )
}

// Performance Badge Component
export function PerformanceBadge({ 
  metric, 
  value, 
  threshold,
  className 
}: { 
  metric: string
  value: number
  threshold: { excellent: number; good: number }
  className?: string 
}) {
  const getPerformanceLevel = () => {
    if (value >= threshold.excellent) return { level: 'excellent', color: 'bg-green-100 text-green-800' }
    if (value >= threshold.good) return { level: 'good', color: 'bg-blue-100 text-blue-800' }
    return { level: 'needs-improvement', color: 'bg-yellow-100 text-yellow-800' }
  }

  const performance = getPerformanceLevel()

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      performance.color,
      className
    )}>
      {metric}: {performance.level.replace('-', ' ')}
    </div>
  )
}
