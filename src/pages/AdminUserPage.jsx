import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import API_BASE_URL from '../config/api'

import { 
  Users, 
  Search,
  Filter,
  ArrowLeft,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  ShoppingCart,
  MapPin
} from 'lucide-react'

const AdminUserPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const navigate = useNavigate()

  const userStatuses = [
    { value: 'active', label: '正常', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'inactive', label: '未激活', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'banned', label: '已封禁', color: 'bg-red-100 text-red-800', icon: Ban }
  ]

  useEffect(() => {
    // 检查管理员权限
    const adminUser = localStorage.getItem('admin_user')
    if (!adminUser) {
      navigate('/admin/login')
      return
    }
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/users`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        console.error('Failed to fetch users')
        // 如果API失败，使用模拟数据
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchUsers()
        alert('用户状态更新成功！')
      } else {
        alert('更新失败，请重试')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('网络错误，请重试')
    }
  }

  const fetchUserDetail = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setSelectedUser(userData)
        setShowUserDetail(true)
      }
    } catch (error) {
      console.error('Error fetching user detail:', error)
    }
  }

  const getStatusInfo = (status) => {
    return userStatuses.find(s => s.value === status) || userStatuses[0]
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm)
    const matchesStatus = !statusFilter || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回仪表板
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">用户管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                总用户: {users.length}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                活跃用户: {users.filter(u => u.status === 'active').length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="搜索用户ID、用户名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="所有状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有状态</SelectItem>
                  {userStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              用户列表 ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无用户</h3>
                <p className="text-gray-600">等待用户注册...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">用户信息</th>
                      <th className="text-left p-4">邮箱</th>
                      <th className="text-left p-4">状态</th>
                      <th className="text-left p-4">注册时间</th>
                      <th className="text-left p-4">最后登录</th>
                      <th className="text-left p-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const statusInfo = getStatusInfo(user.status || 'active')
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {user.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.username || '未知用户'}</div>
                                <div className="text-sm text-gray-600">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{user.email || '未提供'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {user.created_at ? formatDate(user.created_at) : '未知'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {user.last_login ? formatDate(user.last_login) : '从未登录'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => fetchUserDetail(user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select 
                                value={user.status || 'active'} 
                                onValueChange={(value) => updateUserStatus(user.id, value)}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <Edit className="h-3 w-3" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 用户详情模态框 */}
        {showUserDetail && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">用户详情</h2>
                  <Button variant="ghost" onClick={() => setShowUserDetail(false)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      基本信息
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户ID:</span>
                        <span className="font-medium">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户名:</span>
                        <span className="font-medium">{selectedUser.username || '未设置'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">邮箱:</span>
                        <span className="font-medium">{selectedUser.email || '未提供'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">状态:</span>
                        <Badge className={getStatusInfo(selectedUser.status || 'active').color}>
                          {getStatusInfo(selectedUser.status || 'active').label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 时间信息 */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      时间信息
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">注册时间:</span>
                        <span>{selectedUser.created_at ? formatDate(selectedUser.created_at) : '未知'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最后登录:</span>
                        <span>{selectedUser.last_login ? formatDate(selectedUser.last_login) : '从未登录'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最后更新:</span>
                        <span>{selectedUser.updated_at ? formatDate(selectedUser.updated_at) : '未知'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 订单统计 */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      订单统计
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">总订单数:</span>
                        <span className="font-medium">{selectedUser.order_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">总消费金额:</span>
                        <span className="font-medium text-green-600">¥{selectedUser.total_spent?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均订单金额:</span>
                        <span className="font-medium">¥{selectedUser.avg_order_value?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 地址信息 */}
                  {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        收货地址 ({selectedUser.addresses.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedUser.addresses.map((address, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{address.name} {address.phone}</div>
                                <div className="text-sm text-gray-600">
                                  {address.province} {address.city} {address.district}
                                </div>
                                <div className="text-sm text-gray-600">{address.address_line}</div>
                              </div>
                              {address.is_default && (
                                <Badge variant="secondary">默认</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 最近订单 */}
                  {selectedUser.recent_orders && selectedUser.recent_orders.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">最近订单</h3>
                      <div className="space-y-2">
                        {selectedUser.recent_orders.map((order, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">订单 #{order.id}</div>
                                <div className="text-sm text-gray-600">
                                  {formatDate(order.created_at)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">¥{order.total_amount?.toFixed(2)}</div>
                                <Badge className={getStatusInfo(order.status).color}>
                                  {getStatusInfo(order.status).label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUserPage

