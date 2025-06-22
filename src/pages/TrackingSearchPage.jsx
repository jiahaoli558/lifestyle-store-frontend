import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Package, Truck } from 'lucide-react'

const TrackingSearchPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      navigate(`/tracking/${trackingNumber.trim()}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">物流跟踪</h1>
          <p className="text-gray-600">输入快递单号查询您的包裹状态</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              查询快递
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="tracking-number">快递单号</Label>
                <Input
                  id="tracking-number"
                  type="text"
                  placeholder="请输入快递单号，如：SF1234567890123"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!trackingNumber.trim()}>
                <Search className="h-4 w-4 mr-2" />
                查询物流
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 支持的快递公司 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              支持的快递公司
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '顺丰速运',
                '中国邮政EMS',
                '申通快递',
                '圆通速递',
                '中通快递',
                '韵达速递',
                '京东物流',
                '德邦快递'
              ].map((carrier) => (
                <div key={carrier} className="text-center p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium">{carrier}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p>在上方输入框中输入您的快递单号</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p>点击"查询物流"按钮开始查询</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p>查看详细的物流轨迹和配送状态</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TrackingSearchPage

