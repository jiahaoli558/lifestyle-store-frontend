import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext'; // 确保路径正确
import { useCart } from '@/contexts/CartContext'; // 确保路径正确

const Header = () => {
  const { user, logout } = useAuth(); // 从 AuthContext 获取 user 和 logout
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navigation = [
    { name: '首页', href: '/' },
    { name: '全部商品', href: '/products' },
    { name: '厨房用品', href: '/products?category=kitchen' },
    { name: '家居装饰', href: '/products?category=home-decor' },
    { name: '个人护理', href: '/products?category=personal-care' },
    { name: '关于我们', href: '/about' }
  ];

  const handleLogout = () => {
    logout(); // 调用 AuthContext 提供的 logout 函数
    // 不需要手动 removeItem 或 reload，AuthContext 会处理
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-bold text-blue-600">生活用品</span>
        </Link>

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

        {/* Search Bar & User Auth */}
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
            {user ? ( // 根据 user 状态显示不同内容
              <>
                <span className="text-green-600">欢迎，{user.username}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">退出登录</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="mr-2 text-gray-700 hover:text-gray-900">登录</Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900">注册</Link>
              </>
            )}
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* User Account - 仅作为图标，不处理登录逻辑 */}
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

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Mobile menu icon */}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (根据 isMenuOpen 状态显示) */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-gray-900 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <span className="text-green-600 py-2">欢迎，{user.username}</span>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">退出登录</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 py-2">登录</Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900 py-2">注册</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

 
