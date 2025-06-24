import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import AddAddressModal from '@/components/AddAddressModal'
import { 
  User, 
  MapPin, 
  Heart, 
  CreditCard, 
  Bell, 
  Package, 
  Edit,
  Plus,
  Trash2,
  Star
} from 'lucide-react'

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [notifications, setNotifications] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    gender: ''
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // 获取用户资料
      const profileRes = await fetch(`${API_BASE_URL}/profile/${user.id}`)
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
        setProfileForm({
          username: profileData.user.username || '',
          email: profileData.user.email || '',
          first_name: profileData.profile.first_name || '',
          last_name: profileData.profile.last_name || '',
          phone: profileData.profile.phone || '',
          birth_date: profileData.profile.birth_date || '',
          gender: profileData.profile.gender || ''
        })
      }

      // 获取地址列表
      const addressRes = await fetch(`${API_BASE_URL}/addresses/${user.id}`)
      if (addressRes.ok) {
        const addressData = await addressRes.json()
        setAddresses(addressData)
      }

      // 获取收藏夹
      const wishlistRes = await fetch(`${API_BASE_URL}/wishlist/${user.id}`)
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json()
        setWishlist(wishlistData)
      }

      // 获取通知
      const notificationRes = await fetch(`${API_BASE_URL}/notifications/${user.id}`)
      if (notificationRes.ok) {
        const notificationData = await notificationRes.json()
        setNotifications(notificationData.notifications || [])
      }

      // 获取支付方式
      const paymentRes = await fetch(`${API_BASE_URL}/payment-methods/${user.id}`)
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json()
        setPaymentMethods(paymentData)
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditingProfile(false)
        alert('个人资料更新成功！')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('更新失败，请重试')
    }
  }

  const removeFromWishlist = async (wishlistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== wishlistId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const handleAddressAdded = (newAddress) => {
    setAddresses([...addresses, newAddress])
  }

  const deleteAddress = async (addressId) => {
    if (!confirm('确定要删除这个地址吗？')) return

    try {
      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId))
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('删除失败，请重试')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">请先登录</h1>
          <p className="text-gray-600">您需要登录才能查看个人中心</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">个人中心</h1>
        <p className="text-gray-600">管理您的个人信息和订单</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            个人资料
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            收货地址
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            我的订单
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            收藏夹
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            支付方式
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            通知
          </TabsTrigger>
        </TabsList>

        {/* 个人资料 */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>个人资料</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setEditingProfile(!editingProfile)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {editingProfile ? '取消编辑' : '编辑资料'}
              </Button>
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">用户名</Label>
                      <Input
                        id="username"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="first_name">姓</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">名</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">手机号</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birth_date">生日</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={profileForm.birth_date}
                        onChange={(e) => setProfileForm({...profileForm, birth_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">保存更改</Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                      取消
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.profile?.avatar} />
                      <AvatarFallback>
                        {profile?.user?.username?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {profile?.profile?.first_name && profile?.profile?.last_name 
                          ? `${profile.profile.first_name} ${profile.profile.last_name}`
                          : profile?.user?.username
                        }
                      </h3>
                      <p className="text-gray-600">{profile?.user?.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">手机号</Label>
                      <p>{profile?.profile?.phone || '未设置'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">生日</Label>
                      <p>{profile?.profile?.birth_date || '未设置'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">性别</Label>
                      <p>{profile?.profile?.gender || '未设置'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">注册时间</Label>
                      <p>{new Date(profile?.user?.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 收货地址 */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>收货地址</CardTitle>
              <AddAddressModal userId={user.id} onAddressAdded={handleAddressAdded} />
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">暂无收货地址</p>
                  <AddAddressModal userId={user.id} onAddressAdded={handleAddressAdded} />
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{address.name}</span>
                            <span className="text-gray-600">{address.phone}</span>
                            {address.is_default && (
                              <Badge variant="secondary">默认</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {address.country} {address.province} {address.city} {address.district}
                          </p>
                          <p className="text-gray-600">{address.address_line}</p>
                          {address.postal_code && (
                            <p className="text-gray-600">邮编: {address.postal_code}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteAddress(address.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 我的订单 */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>我的订单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">暂无订单记录</p>
                <Button asChild>
                  <Link to="/tracking">查询物流</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 收藏夹 */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>我的收藏</CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">暂无收藏商品</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <img 
                        src={item.product?.image} 
                        alt={item.product?.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-medium mb-2">{item.product?.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            ¥{item.product?.price}
                          </span>
                          {item.product?.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{item.product.rating}</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 支付方式 */}
        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>支付方式</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加支付方式
              </Button>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">暂无支付方式</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-8 w-8" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{method.provider}</span>
                              {method.is_default && (
                                <Badge variant="secondary">默认</Badge>
                              )}
                            </div>
                            <p className="text-gray-600">**** **** **** {method.last_four}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>消息通知</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">暂无通知消息</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border rounded-lg p-4 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium mb-1">{notification.title}</h4>
                          <p className="text-gray-600 mb-2">{notification.content}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <Badge variant="secondary">未读</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage



