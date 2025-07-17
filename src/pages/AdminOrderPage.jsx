import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import API_BASE_URL from '../config/api'

import { 
  ShoppingCart, 
  Search,
  Filter,
  ArrowLeft,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone
} from 'lucide-react'

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const navigate = useNavigate()

  const orderStatuses = [
    { value: 'pending', label: '待处理', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'confirmed', label: '已确认', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { value: 'shipped', label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Truck },
    { value: 'delivered', label: '已送达', color: 'bg-green-100 text-green-800', icon: Package },
    { value: 'cancelled', label: '已取消', color: 'bg-red-100 text-red-800', icon: XCircle }
  ]

  useEffect(() => {
    // 检查管理员权限
    const adminUser = localStorage.getItem('admin_user')
    if (!adminUser) {
      navigate('/admin/login')
      return
    }
    fetchOrders()
  }, [navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/orders`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders')
        // 如果API失败，使用模拟数据进行演示
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchOrders()
        alert('订单状态更新成功！')
      } else {
        alert('更新失败，请重试')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('网络错误，请重试')
    }
  }

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0]
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().includes(searchTerm) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
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
              <h1 className="text-2xl font-bold text-gray-900 ml-4">订单管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                总订单: {orders.length}
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
                    placeholder="搜索订单号、用户名或邮箱..."
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
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 订单列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              订单列表 ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
                <p className="text-gray-600">等待用户下单...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">订单信息</th>
                      <th className="text-left p-4">用户</th>
                      <th className="text-left p-4">金额</th>
                      <th className="text-left p-4">状态</th>
                      <th className="text-left p-4">下单时间</th>
                      <th className="text-left p-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">订单 #{order.id}</div>
                              <div className="text-sm text-gray-600">
                                {order.items?.length || 0} 件商品
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{order.user?.username || '未知用户'}</div>
                              <div className="text-sm text-gray-600">{order.user?.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">¥{order.total_amount?.toFixed(2) || '0.00'}</div>
                            <div className="text-sm text-gray-600">{order.payment_method || '未知'}</div>
                          </td>
                          <td className="p-4">
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {formatDate(order.created_at)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setShowOrderDetail(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select 
                                value={order.status} 
                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <Edit className="h-3 w-3" />
                                </SelectTrigger>
                                <SelectContent>
                                  {orderStatuses.map((status) => (
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

        {/* 订单详情模态框 */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">订单详情 #{selectedOrder.id}</h2>
                  <Button variant="ghost" onClick={() => setShowOrderDetail(false)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* 订单状态 */}
                  <div>
                    <h3 className="font-medium mb-2">订单状态</h3>
                    <Badge className={getStatusInfo(selectedOrder.status).color}>
                      {getStatusInfo(selectedOrder.status).label}
                    </Badge>
                  </div>

                  {/* 用户信息 */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      用户信息
                    </h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>用户名:</strong> {selectedOrder.user?.username}</p>
                      <p><strong>邮箱:</strong> {selectedOrder.user?.email}</p>
                    </div>
                  </div>

                  {/* 收货地址 */}
                  {selectedOrder.shipping_address && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        收货地址
                      </h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <p><strong>收货人:</strong> {selectedOrder.shipping_address.name}</p>
                        <p><strong>电话:</strong> {selectedOrder.shipping_address.phone}</p>
                        <p><strong>地址:</strong> {selectedOrder.shipping_address.province} {selectedOrder.shipping_address.city} {selectedOrder.shipping_address.district}</p>
                        <p>{selectedOrder.shipping_address.address_line}</p>
                      </div>
                    </div>
                  )}

                  {/* 商品列表 */}
                  <div>
                    <h3 className="font-medium mb-2">商品列表</h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.product?.name || '商品已删除'}</div>
                            <div className="text-sm text-gray-600">数量: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-600">单价: ¥{item.price}</div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-600">暂无商品信息</p>
                      )}
                    </div>
                  </div>

                  {/* 订单总计 */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>订单总计:</span>
                      <span className="text-red-600">¥{selectedOrder.total_amount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      支付方式: {selectedOrder.payment_method || '未知'}
                    </div>
                  </div>

                  {/* 时间信息 */}
                  <div className="text-sm text-gray-600">
                    <p><strong>下单时间:</strong> {formatDate(selectedOrder.created_at)}</p>
                    {selectedOrder.updated_at && (
                      <p><strong>更新时间:</strong> {formatDate(selectedOrder.updated_at)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrderPage

