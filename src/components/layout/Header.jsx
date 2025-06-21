import React, { useState } from 'react' // Removed useEffect
import { Link, useNavigate } from 'react-router-dom' // Removed useLocation
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import SearchModal from '@/components/ui/SearchModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logout, updateCount } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  
  const navigation = [
    { name: '首页', href: '/' },
    { name: '全部商品', href: '/products' },
    { name: '厨房用品', href: '/products?category=kitchen' },
    { name: '家居装饰', href: '/products?category=home-decor' },
    { name: '个人护理', href: '/products?category=personal-care' },
    { name: '物流跟踪', href: '/tracking' },
    { name: '关于我们', href: '/about' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (searchTerm) => {
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                LifeStyle Store
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      个人中心
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">登录</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">注册</Link>
                  </Button>
                </div>
              )}

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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setIsSearchOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  搜索商品...
                </Button>
              </div>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user && (
                <div className="border-t pt-2 mt-2">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </>
  )
}

export default Header

 

 

 


