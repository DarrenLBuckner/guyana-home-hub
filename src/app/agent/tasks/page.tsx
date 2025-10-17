'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  User,
  AlertTriangle,
  Star,
  Plus,
  Filter,
  Search,
  Home,
  Target,
  TrendingUp
} from 'lucide-react'

interface Task {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  type: 'email' | 'call' | 'meeting' | 'property_tour'
  subject: string
  description: string
  scheduled_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}

export default function AgentTasks() {
  const router = useRouter()
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      // Mock data for demonstration (replace with real API)
      const mockTasks: Task[] = [
        {
          id: '1',
          customer_id: '1',
          customer_name: 'Sarah Johnson',
          customer_email: 'sarah.johnson@email.com',
          type: 'call',
          subject: 'Follow-up call - Georgetown property inquiry',
          description: 'Contact Sarah about her interest in the Georgetown family home. She has pre-approval and is ready to move quickly.',
          scheduled_date: '2025-07-22T10:00:00Z',
          priority: 'high',
          status: 'pending',
          created_at: '2025-07-21T08:00:00Z'
        },
        {
          id: '2',
          customer_id: '2',
          customer_name: 'Michael Chen',
          customer_email: 'michael.chen@business.com',
          type: 'meeting',
          subject: 'Commercial property consultation',
          description: 'Meet with Michael to discuss his commercial investment portfolio expansion plans.',
          scheduled_date: '2025-07-22T14:00:00Z',
          priority: 'urgent',
          status: 'pending',
          created_at: '2025-07-21T09:00:00Z'
        },
        {
          id: '3',
          customer_id: '3',
          customer_name: 'Emily Rodriguez',
          customer_email: 'emily.r@gmail.com',
          type: 'email',
          subject: 'Send apartment rental options',
          description: 'Send Emily a curated list of modern apartments in Georgetown within her budget range.',
          scheduled_date: '2025-07-22T09:00:00Z',
          priority: 'medium',
          status: 'pending',
          created_at: '2025-07-21T10:00:00Z'
        },
        {
          id: '4',
          customer_id: '1',
          customer_name: 'Sarah Johnson',
          customer_email: 'sarah.johnson@email.com',
          type: 'property_tour',
          subject: 'Property viewing - 123 Main Street',
          description: 'Show Sarah the Georgetown property at 123 Main Street. Bring property details and comparable sales.',
          scheduled_date: '2025-07-23T15:00:00Z',
          priority: 'high',
          status: 'pending',
          created_at: '2025-07-21T11:00:00Z'
        },
        {
          id: '5',
          customer_id: '4',
          customer_name: 'David Williams',
          customer_email: 'david.w@email.com',
          type: 'call',
          subject: 'Welcome call - New lead',
          description: 'Initial contact with David who inquired about investment properties in New Amsterdam.',
          scheduled_date: '2025-07-21T16:00:00Z',
          priority: 'medium',
          status: 'completed',
          created_at: '2025-07-20T14:00:00Z'
        }
      ]

      setTasks(mockTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const }
          : task
      ))
      // In real app, update database
      console.log('Task completed:', taskId)
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'call': return <Phone className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'meeting': return <User className="h-4 w-4" />
      case 'property_tour': return <Home className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const isOverdue = (scheduledDate: string) => {
    return new Date(scheduledDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesSearch = task.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const overdueTasks = pendingTasks.filter(t => isOverdue(t.scheduled_date))
  const todayTasks = pendingTasks.filter(t => {
    const taskDate = new Date(t.scheduled_date).toDateString()
    const today = new Date().toDateString()
    return taskDate === today
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading tasks...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
              <p className="text-sm text-gray-600">{filteredTasks.length} tasks</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
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
        {/* Task Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">All caught up! No tasks match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)} border`}>
                          {getTypeIcon(task.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{task.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {task.customer_name} • {task.customer_email}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {isOverdue(task.scheduled_date) && task.status === 'pending' && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                            OVERDUE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(task.scheduled_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Created {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      {task.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => completeTask(task.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Complete</span>
                          </button>
                          <div className="flex space-x-2">
                            {task.type === 'call' && (
                              <a 
                                href={`tel:${task.customer_email}`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Call Customer"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            )}
                            <a 
                              href={`mailto:${task.customer_email}`}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                              title="Email Customer"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          </div>
                        </>
                      ) : (
                        <span className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
