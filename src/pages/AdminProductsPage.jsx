import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import API_BASE_URL from '../config/api'

import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ArrowLeft,
  Save,
  X,
  Upload,
  Eye
} from 'lucide-react'

const AdminProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image: '',
    category: '',
    stock: '',
    is_new: false,
    discount: ''
  })
  const navigate = useNavigate()

  // 预定义分类
  const predefinedCategories = [
    { value: 'kitchen', label: '厨房用品' },
    { value: 'home-decor', label: '家居装饰' },
    { value: 'personal-care', label: '个人护理' },
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装配饰' },
    { value: 'sports', label: '运动户外' },
    { value: 'books', label: '图书文具' },
    { value: 'toys', label: '玩具游戏' }
  ]

  useEffect(() => {
    // 检查管理员权限
    const adminUser = localStorage.getItem('admin_user')
    if (!adminUser) {
      navigate('/admin/login')
      return
    }
    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Failed to fetch products')
        // 如果API失败，使用模拟数据
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 验证必填字段
      if (!formData.name || !formData.price || !formData.category) {
        alert('请填写商品名称、价格和分类')
        return
      }

      const url = editingProduct 
        ? `${API_BASE_URL}/admin/products/${editingProduct.id}`
        : `${API_BASE_URL}/admin/products`
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        is_new: formData.is_new,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        review_count: 0,
        rating: 0.0
      }

      console.log('Submitting product data:', productData)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Product saved successfully:', result)
        await fetchProducts() // 重新获取商品列表
        resetForm()
        alert(editingProduct ? '商品更新成功！' : '商品创建成功！')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to save product:', errorData)
        alert(`操作失败: ${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('确定要删除这个商品吗？此操作不可恢复。')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProducts()
        alert('商品删除成功！')
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`删除失败: ${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('网络错误，请重试')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      image: product.image || '',
      category: product.category || '',
      stock: product.stock?.toString() || '0',
      is_new: product.is_new || false,
      discount: product.discount?.toString() || '0'
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      image: '',
      category: '',
      stock: '0',
      is_new: false,
      discount: '0'
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回仪表板
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">商品管理</h1>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              添加商品
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 添加/编辑商品表单 */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingProduct ? '编辑商品' : '添加新商品'}</span>
                <Button variant="ghost" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 商品名称 */}
                  <div>
                    <Label htmlFor="name">商品名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="请输入商品名称"
                      required
                    />
                  </div>
                  
                  {/* 分类 */}
                  <div>
                    <Label htmlFor="category">商品分类 *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择商品分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 价格 */}
                  <div>
                    <Label htmlFor="price">销售价格 (¥) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  {/* 原价 */}
                  <div>
                    <Label htmlFor="original_price">原价 (¥)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.original_price}
                      onChange={(e) => handleInputChange('original_price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* 库存 */}
                  <div>
                    <Label htmlFor="stock">库存数量</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  {/* 折扣 */}
                  <div>
                    <Label htmlFor="discount">折扣 (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                {/* 图片URL */}
                <div>
                  <Label htmlFor="image">商品图片URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    {formData.image && (
                      <Button type="button" variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="预览" 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* 商品描述 */}
                <div>
                  <Label htmlFor="description">商品描述</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="请输入商品详细描述..."
                    rows={4}
                  />
                </div>
                
                {/* 新品标识 */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => handleInputChange('is_new', checked)}
                  />
                  <Label htmlFor="is_new">标记为新品</Label>
                </div>
                
                {/* 提交按钮 */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingProduct ? '更新中...' : '创建中...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingProduct ? '更新商品' : '创建商品'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="搜索商品名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="所有分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有分类</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {predefinedCategories.find(c => c.value === category)?.label || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 商品列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              商品列表 ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无商品</h3>
                <p className="text-gray-600 mb-4">开始添加您的第一个商品吧</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  添加商品
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">商品信息</th>
                      <th className="text-left p-4">分类</th>
                      <th className="text-left p-4">价格</th>
                      <th className="text-left p-4">库存</th>
                      <th className="text-left p-4">状态</th>
                      <th className="text-left p-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                              }}
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {predefinedCategories.find(c => c.value === product.category)?.label || product.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">¥{product.price}</div>
                          {product.original_price && product.original_price > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ¥{product.original_price}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            (product.stock || 0) > 10 
                              ? 'bg-green-100 text-green-800' 
                              : (product.stock || 0) > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {product.is_new && <Badge variant="secondary">新品</Badge>}
                            {product.discount > 0 && <Badge variant="destructive">-{product.discount}%</Badge>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProductsPage

