import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import API_BASE_URL from '../config/api'

import { 
  CreditCard, 
  Smartphone, 
  Wallet,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  User,
  Phone
} from 'lucide-react'

const PaymentPage = () => {
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('alipay')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address_line: '',
    postal_code: ''
  })
  
  // 支付状态页面
  const sessionId = searchParams.get('session_id')
  const paymentStatus = searchParams.get('status')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (items.length === 0 && !sessionId) {
      navigate('/cart')
      return
    }
    
    fetchUserAddresses()
  }, [user, items, navigate, sessionId])

  const fetchUserAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/addresses/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
        // 自动选择默认地址
        const defaultAddr = data.find(addr => addr.is_default)
        if (defaultAddr) {
          setSelectedAddress(defaultAddr)
        } else if (data.length > 0) {
          setSelectedAddress(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addressForm,
          user_id: user.id,
          country: '中国',
          is_default: addresses.length === 0
        })
      })

      if (response.ok) {
        const newAddress = await response.json()
        setAddresses([...addresses, newAddress])
        setSelectedAddress(newAddress)
        setShowAddressForm(false)
        setAddressForm({
          name: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          address_line: '',
          postal_code: ''
        })
      }
    } catch (error) {
      console.error('Error adding address:', error)
      alert('添加地址失败，请重试')
    }
  }

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址')
      return
    }

    setLoading(true)
    
    try {
      // 创建订单
      const orderData = {
        user_id: user.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: selectedAddress,
        payment_method: paymentMethod,
        total_amount: getTotalPrice()
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        
        // 模拟支付处理
        setTimeout(() => {
          clearCart()
          navigate(`/payment?status=success&order_id=${order.id}`)
        }, 2000)
      } else {
        throw new Error('创建订单失败')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('支付失败，请重试')
      setLoading(false)
    }
  }

  // 支付成功页面
  if (paymentStatus === 'success') {
    const orderId = searchParams.get('order_id')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">支付成功！</h2>
            <p className="text-gray-600 mb-6">
              您的订单已提交成功，我们将尽快为您处理。
            </p>
            {orderId && (
              <p className="text-sm text-gray-500 mb-6">
                订单号：{orderId}
              </p>
            )}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/profile?tab=orders')} 
                className="w-full"
              >
                查看订单
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                继续购物
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 支付失败页面
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">支付失败</h2>
            <p className="text-gray-600 mb-6">
              支付过程中出现问题，请重试或联系客服。
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/cart')} className="w-full">
                返回购物车
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                继续购物
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">结算</h1>
          <p className="text-gray-600">请确认您的订单信息并选择支付方式</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：地址和支付方式 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 收货地址 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  收货地址
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">暂无收货地址</p>
                    <Button onClick={() => setShowAddressForm(true)}>
                      添加收货地址
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.name}</span>
                              <span className="text-gray-600">{address.phone}</span>
                              {address.is_default && (
                                <Badge variant="secondary">默认</Badge>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {address.province} {address.city} {address.district}
                            </p>
                            <p className="text-gray-600">{address.address_line}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedAddress?.id === address.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAddress?.id === address.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddressForm(true)}
                      className="w-full"
                    >
                      添加新地址
                    </Button>
                  </div>
                )}

                {/* 添加地址表单 */}
                {showAddressForm && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4">添加新地址</h4>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">收货人姓名</Label>
                          <Input
                            id="name"
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">手机号码</Label>
                          <Input
                            id="phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="province">省份</Label>
                          <Input
                            id="province"
                            value={addressForm.province}
                            onChange={(e) => setAddressForm({...addressForm, province: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">城市</Label>
                          <Input
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="district">区县</Label>
                          <Input
                            id="district"
                            value={addressForm.district}
                            onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address_line">详细地址</Label>
                        <Input
                          id="address_line"
                          value={addressForm.address_line}
                          onChange={(e) => setAddressForm({...addressForm, address_line: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">保存</Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAddressForm(false)}
                        >
                          取消
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 支付方式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  支付方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="alipay" id="alipay" />
                    <Label htmlFor="alipay" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">支付宝</div>
                        <div className="text-sm text-gray-600">使用支付宝安全支付</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="wechat" id="wechat" />
                    <Label htmlFor="wechat" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">微信支付</div>
                        <div className="text-sm text-gray-600">使用微信安全支付</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="stripe" id="stripe" disabled />
                    <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">信用卡支付</div>
                        <div className="text-sm text-gray-600">暂不可用</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：订单摘要 */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-gray-600 text-sm">数量: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>商品总计</span>
                      <span>¥{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>运费</span>
                      <span>免费</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>总计</span>
                      <span className="text-red-600">¥{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayment}
                    disabled={loading || !selectedAddress}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        立即支付
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    点击支付即表示您同意我们的服务条款
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

