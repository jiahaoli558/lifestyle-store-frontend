import React, { useState,useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { useCart } from '@/contexts/CartContext'
import { fetchProducts, fetchCategories } from '@/services/api'


const ProductDetailPage = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      setProducts(productsData);
      setCategoryList(categoriesData);
      setLoading(false); 
    };
    loadData();
  }, []);

  const product = products.find(p => p.id === id || p.id.toString() === id);

  // 如果数据加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">加载中...</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品未找到</h1>
          <Link to="/products">
            <Button>返回商品列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  //images for the product
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ]

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">首页</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-700">商品</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回商品列表
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.isNew && (
                <Badge className="bg-green-500 mb-2">新品</Badge>
              )}
              {product.discount && (
                <Badge className="bg-red-500 mb-2 ml-2">-{product.discount}%</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviews} 条评价)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ¥{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ¥{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数量
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500 ml-4">
                  库存: {product.stock} 件
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                加入购物车
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5 mr-2" />
                收藏
              </Button>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                免费配送
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                品质保证
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                30天退换
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">商品详情</TabsTrigger>
              <TabsTrigger value="specifications">规格参数</TabsTrigger>
              <TabsTrigger value="reviews">用户评价</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">商品详情</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      这款商品采用优质材料制作，经过严格的质量检测，确保为您提供最佳的使用体验。
                      我们注重每一个细节，从设计到制造，都体现了我们对品质的追求。
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      适合日常使用，简约的设计风格能够很好地融入各种家居环境。
                      无论是自用还是送礼，都是不错的选择。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">规格参数</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">品牌</span>
                        <span className="font-medium">LifeStyle Store</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">材质</span>
                        <span className="font-medium">优质材料</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">颜色</span>
                        <span className="font-medium">如图所示</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">重量</span>
                        <span className="font-medium">适中</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">保修期</span>
                        <span className="font-medium">1年</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">产地</span>
                        <span className="font-medium">中国</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">用户评价</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            用户{review}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            2024-01-{10 + review}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          商品质量很好，包装精美，物流速度快，非常满意的一次购物体验！
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">相关商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage

