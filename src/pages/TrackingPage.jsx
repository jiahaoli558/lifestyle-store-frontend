import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Copy,
  Phone,
  Mail
} from 'lucide-react'

const TrackingPage = () => {
  const { trackingNumber } = useParams()
  const navigate = useNavigate()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (trackingNumber) {
      fetchTrackingInfo()
    }
  }, [trackingNumber])

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/shipping/track/${trackingNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setShipment(data)
      } else {
        setError('未找到该快递单号的信息')
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error)
      setError('获取物流信息失败')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'picked_up':
        return 'bg-blue-100 text-blue-800'
      case 'in_transit':
        return 'bg-purple-100 text-purple-800'
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待发货'
      case 'picked_up':
        return '已揽收'
      case 'in_transit':
        return '运输中'
      case 'out_for_delivery':
        return '派送中'
      case 'delivered':
        return '已送达'
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'picked_up':
        return <Package className="h-4 w-4" />
      case 'in_transit':
        return <Truck className="h-4 w-4" />
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumber)
    alert('快递单号已复制到剪贴板')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">正在查询物流信息...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">查询失败</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">物流跟踪</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：物流详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  快递信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">快递单号</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-lg">{shipment.tracking_number}</span>
                      <Button variant="ghost" size="sm" onClick={copyTrackingNumber}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">快递公司</label>
                    <p className="mt-1">{shipment.carrier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">服务类型</label>
                    <p className="mt-1">{shipment.carrier_service}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">当前状态</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(shipment.status)}>
                        {getStatusIcon(shipment.status)}
                        <span className="ml-1">{getStatusText(shipment.status)}</span>
                      </Badge>
                    </div>
                  </div>
                  {shipment.shipped_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">发货时间</label>
                      <p className="mt-1">{new Date(shipment.shipped_at).toLocaleString()}</p>
                    </div>
                  )}
                  {shipment.estimated_delivery && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">预计送达</label>
                      <p className="mt-1">{new Date(shipment.estimated_delivery).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 物流轨迹 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  物流轨迹
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shipment.tracking_records && shipment.tracking_records.length > 0 ? (
                  <div className="space-y-4">
                    {shipment.tracking_records
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((record, index) => (
                        <div key={record.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                            </div>
                            {index < shipment.tracking_records.length - 1 && (
                              <div className="w-px h-8 bg-gray-300 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{getStatusText(record.status)}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(record.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{record.description}</p>
                            {record.location && (
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {record.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">暂无物流轨迹信息</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：帮助信息 */}
          <div className="space-y-6">
            {/* 配送进度 */}
            <Card>
              <CardHeader>
                <CardTitle>配送进度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'pending', label: '订单确认' },
                    { status: 'picked_up', label: '商品出库' },
                    { status: 'in_transit', label: '运输途中' },
                    { status: 'out_for_delivery', label: '正在派送' },
                    { status: 'delivered', label: '签收完成' }
                  ].map((step, index) => {
                    const isCompleted = shipment.tracking_records?.some(record => 
                      record.status === step.status
                    )
                    const isCurrent = shipment.status === step.status
                    
                    return (
                      <div key={step.status} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <span className={`${
                          isCompleted || isCurrent ? 'font-medium' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 联系客服 */}
            <Card>
              <CardHeader>
                <CardTitle>需要帮助？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">客服热线</p>
                    <p className="text-sm text-gray-600">400-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">邮箱咨询</p>
                    <p className="text-sm text-gray-600">service@lifestylestore.com</p>
                  </div>
                </div>
                <Separator />
                <div className="text-sm text-gray-600">
                  <p className="mb-2">常见问题：</p>
                  <ul className="space-y-1">
                    <li>• 快递丢失或损坏怎么办？</li>
                    <li>• 如何修改收货地址？</li>
                    <li>• 配送时间说明</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage

