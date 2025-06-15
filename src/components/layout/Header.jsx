import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  })
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    // 登录/注册后页面跳转时，重新读取 user
    const handleStorage = () => {
      const userData = localStorage.getItem('user')
      setUser(userData ? JSON.parse(userData) : null)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 登录/注册后跳转时也刷新 user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    setUser(userData ? JSON.parse(userData) : null)
  }, [window.location.pathname])

  const navigation = [
    { name: '首页', href: '/' },
    { name: '全部商品', href: '/products' },
    { name: '厨房用品', href: '/products?category=kitchen' },
    { name: '家居装饰', href: '/products?category=home-decor' },
    { name: '个人护理', href: '/products?category=personal-care' },
    { name: '关于我们', href: '/about' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              LifeStyle Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar & 登录/注册/欢迎/退出 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 items-center">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="搜索商品..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <>
                  <span className="text-green-600">欢迎，{user.username}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">退出登录</Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mr-2">登录</Link>
                  <Link to="/register">注册</Link>
                </>
              )}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="搜索商品..."
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-3">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-green-600 px-3">欢迎，{user.username}</span>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      退出登录
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                      登录
                    </Link>
                    <Link to="/register" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
 
