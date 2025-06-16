import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { fetchProducts, fetchCategories, fetchUserProfile } from '@/services/api' // Added fetchUserProfile
import { useState, useEffect } from 'react'


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState(null); // New state for profile
  const [profileError, setProfileError] = useState(null); // New state for profile error

  const handleFetchProfile = async () => {
    console.log('Fetch Profile button clicked, handleFetchProfile function entered.'); // New log
    setProfileData(null); // Reset previous data
    setProfileError(null); // Reset previous error
    try {
      const data = await fetchUserProfile();
      setProfileData(data);
      console.log('Profile data:', data);
    } catch (error) {
      setProfileError(error.message || 'Failed to fetch profile');
      console.error('Profile error:', error);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to fetch categories.');
        console.error('Error fetching categories:', err);
      }
    };
    getCategories();
    getProducts();
  }, []); // 空数组表示只在组件挂载时运行一次

  // 从获取到的所有商品中截取前4个作为特色商品
  const featuredProducts = products.slice(0, 4);

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      {/* User Profile Test Section - Temporary */}
      <div className="p-4 border-b bg-yellow-50">
        <h2 className="text-xl font-semibold">User Profile Test (Temporary)</h2>
        <Button 
          onClick={handleFetchProfile}
          className="my-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Profile (Protected Route)
        </Button>
        {profileData && (
          <pre className="mt-2 p-2 bg-gray-100 border rounded text-sm overflow-x-auto">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        )}
        {profileError && (
          <p className="mt-2 text-red-600 font-medium">Error: {profileError}</p>
        )}
      </div>
      {/* End User Profile Test Section */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                精品生活
                <span className="text-blue-600">从这里开始</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                发现高品质的生活用品，让每一天都充满美好。我们精心挑选每一件商品，只为给您带来更好的生活体验。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/products">
                    立即购买
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">了解更多</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop"
                alt="精品生活用品"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              商品分类
            </h2>
            <p className="text-lg text-gray-600">
              探索我们精心策划的商品分类
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              热销商品
            </h2>
            <p className="text-lg text-gray-600">
              精选最受欢迎的商品
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                查看全部商品
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择我们
            </h2>
            <p className="text-lg text-gray-600">
              我们致力于为您提供最好的购物体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">快速配送</h3>
              <p className="text-gray-600">
                全国包邮，48小时内发货，让您尽快收到心仪的商品
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">品质保证</h3>
              <p className="text-gray-600">
                严格的质量把控，30天无理由退换，让您购买无忧
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">贴心服务</h3>
              <p className="text-gray-600">
                7×24小时客服支持，专业团队为您解答任何问题
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            订阅我们的新闻通讯
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            第一时间获取新品上架和优惠信息
          </p>
          
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="请输入您的邮箱"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button size="lg">
              订阅
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 

export default HomePage


