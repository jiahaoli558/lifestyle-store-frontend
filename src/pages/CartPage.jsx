import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h1>
          <p className="text-gray-600 mb-6">快去挑选您喜欢的商品吧！</p>
          <Button asChild>
            <Link to="/products">开始购物</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">购物车</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ¥{item.price}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={clearCart}>
                    清空购物车
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/products">继续购物</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">订单摘要</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品小计</span>
                    <span className="font-medium">¥{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">运费</span>
                    <span className="font-medium">免费</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">税费</span>
                    <span className="font-medium">¥0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">总计</span>
                      <span className="text-lg font-bold text-blue-600">
                        ¥{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg" asChild>
                  <Link to="/payment">
                    去结账
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    支持支付宝、微信支付、银行卡等多种支付方式
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">购物保障</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>正品保证</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>30天无理由退换</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>全国包邮</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>7×24小时客服</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

