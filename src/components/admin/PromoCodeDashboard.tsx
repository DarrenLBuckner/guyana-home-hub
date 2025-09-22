// Simple Admin Dashboard for Promo Code Management
// src/components/admin/PromoCodeDashboard.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { PromoCodeService } from '@/lib/promo-code-service'
import { PromoCode, AgentSubscription } from '@/types/promo-code'
import { Calendar, Users, AlertTriangle, Tag, Clock } from 'lucide-react'

interface PromoCodeDashboardProps {
  className?: string
}

export function PromoCodeDashboard({ className }: PromoCodeDashboardProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [expiringTrials, setExpiringTrials] = useState<AgentSubscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const codes = await PromoCodeService.getActivePromoCodes()
      setPromoCodes(codes)
      
      // TODO: Load expiring trials data
      // This would require additional database functions
      
    } catch (error) {
      console.error('Dashboard data load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getUsagePercentage = (current: number, max: number | null) => {
    if (!max) return 0
    return Math.min((current / max) * 100, 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Promo Code Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Codes</p>
                <p className="text-2xl font-bold text-blue-800">{promoCodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Total Uses</p>
                <p className="text-2xl font-bold text-green-800">
                  {promoCodes.reduce((sum, code) => sum + code.current_uses, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {promoCodes.filter(code => {
                    if (!code.expires_at) return false
                    const daysUntilExpiry = Math.ceil((new Date(code.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Trials Expiring</p>
                <p className="text-2xl font-bold text-red-800">{expiringTrials.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Promo Codes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Promo Codes</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Applies To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Usage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expires</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((code) => {
                const usagePercentage = getUsagePercentage(code.current_uses, code.max_uses)
                const isExpiringSoon = code.expires_at && 
                  Math.ceil((new Date(code.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
                
                return (
                  <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{code.code}</div>
                      <div className="text-xs text-gray-500">{code.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        code.discount_type === 'free_trial' 
                          ? 'bg-green-100 text-green-800'
                          : code.discount_type === 'percentage'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {code.discount_type === 'free_trial' ? 'Free Trial' : 
                         code.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {code.discount_type === 'free_trial' 
                        ? `${code.trial_duration_days} days`
                        : code.discount_type === 'percentage'
                        ? `${code.discount_value}%`
                        : `G$${code.discount_value}`
                      }
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-gray-700">{code.applies_to}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">
                          {code.current_uses}{code.max_uses ? `/${code.max_uses}` : ''}
                        </span>
                        {code.max_uses && (
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' : 
                                usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${usagePercentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {code.expires_at ? (
                        <span className={isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {formatDate(code.expires_at)}
                        </span>
                      ) : (
                        <span className="text-gray-500">Never</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        code.active 
                          ? isExpiringSoon 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {code.active 
                          ? isExpiringSoon ? 'Expiring Soon' : 'Active'
                          : 'Inactive'
                        }
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Tag className="h-6 w-6 text-green-600 mb-2" />
            <div className="font-medium text-gray-800">Create New Code</div>
            <div className="text-sm text-gray-500">Add a new promo code</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-800">View Agents</div>
            <div className="text-sm text-gray-500">Manage agent accounts</div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Calendar className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-800">Trial Calendar</div>
            <div className="text-sm text-gray-500">View trial expirations</div>
          </button>
        </div>
      </div>
    </div>
  )
}
