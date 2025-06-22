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
  Loader2
} from 'lucide-react'

const PaymentPage = () => {
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [stripeConfig, setStripeConfig] = useState(null)
  
  // 支付状态页面
  const sessionId = searchParams.get('session_id')
  const paymentStatus = searchParams.get('status')

  useEffect(() => {
    if (user) {
      fetchUserAddresses()
      fetchStripeConfig()
    }
  }, [user])

  const fetchUserAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/addresses/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
        // 设置默认地址
        const defaultAddress = data.find(addr => addr.is_default)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
        } else if (data.length > 0) {
          setSelectedAddress(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const fetchStripeConfig = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/config')
      if (response.ok) {
        const config = await response.json()
        setStripeConfig(config)
      }
    } catch (error) {
      console.error('Error fetching Stripe config:', error)
    }
  }

  const handleStripePayment = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址')
      return
    }

    setLoading(true)
    try {
      // 创建Stripe Checkout会话
      const response = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          shipping_address: selectedAddress,
          success_url: `${window.location.origin}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/payment?status=cancel`
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // 重定向到Stripe Checkout
        const stripe = window.Stripe(stripeConfig.publicKey)
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.checkout_session_id
        })

        if (error) {
          console.error('Stripe error:', error)
          alert('支付失败，请重试')
        }
      } else {
        alert('创建支付会话失败')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('支付过程中出现错误')
    } finally {
      setLoading(false)
    }
  }

  const handleAlipayPayment = () => {
    alert('支付宝支付功能开发中...')
  }

  const handleWechatPayment = () => {
    alert('微信支付功能开发中...')
  }

  // 支付成功页面
  if (paymentStatus === 'success') {
    useEffect(() => {
      clearCart()
    }, [])

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
            <p className="text-gray-600 mb-6">您的订单已确认，我们将尽快为您发货。</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/profile')} className="w-full">
                查看订单
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

  // 支付取消页面
  if (paymentStatus === 'cancel') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">支付已取消</h2>
            <p className="text-gray-600 mb-6">您的订单尚未完成，商品仍在购物车中。</p>
            <div className="space-y-2">
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">请先登录</h2>
            <p className="text-gray-600 mb-6">您需要登录才能进行支付</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              立即登录
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">购物车为空</h2>
            <p className="text-gray-600 mb-6">请先添加商品到购物车</p>
            <Button onClick={() => navigate('/products')} className="w-full">
              去购物
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">确认订单</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：订单信息和支付方式 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 收货地址 */}
            <Card>
              <CardHeader>
                <CardTitle>收货地址</CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">暂无收货地址</p>
                    <Button onClick={() => navigate('/profile')}>
                      添加地址
                    </Button>
                  </div>
                ) : (
                  <RadioGroup 
                    value={selectedAddress?.id?.toString()} 
                    onValueChange={(value) => {
                      const address = addresses.find(addr => addr.id.toString() === value)
                      setSelectedAddress(address)
                    }}
                  >
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                        <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.name}</span>
                              <span className="text-gray-600">{address.phone}</span>
                              {address.is_default && (
                                <Badge variant="secondary">默认</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.province} {address.city} {address.district} {address.address_line}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* 支付方式 */}
            <Card>
              <CardHeader>
                <CardTitle>支付方式</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">信用卡/借记卡</div>
                        <div className="text-sm text-gray-600">支持Visa、Mastercard等</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="alipay" id="alipay" disabled />
                    <Label htmlFor="alipay" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <div className="font-medium">支付宝</div>
                        <div className="text-sm text-gray-600">即将上线</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="wechat" id="wechat" disabled />
                    <Label htmlFor="wechat" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <div className="font-medium">微信支付</div>
                        <div className="text-sm text-gray-600">即将上线</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：订单摘要 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 商品列表 */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-gray-600 text-sm">数量: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* 费用明细 */}
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>总计</span>
                    <span className="text-red-600">¥{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* 支付按钮 */}
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleStripePayment}
                    disabled={loading || !selectedAddress}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        立即支付 ¥{getTotalPrice().toFixed(2)}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>您的支付信息受到SSL加密保护</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Stripe.js脚本 */}
      <script src="https://js.stripe.com/v3/"></script>
    </div>
  )
}

export default PaymentPage

