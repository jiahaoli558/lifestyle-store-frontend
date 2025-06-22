import React, { useState, useEffect, useMemo } from 'react' // 合并后的导入
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Filter, Grid, List } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { fetchProducts, fetchCategories } from '@/services/api'
// 删除了原来的重复导入行


const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState('default')

  const categoryParam = searchParams.get('category')
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      setProducts(productsData);
      setCategoryList(categoriesData);
    };
    loadData();
  }, []);
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by category from URL param
    if (categoryParam) {
      filtered = filtered.filter(product => product.category === categoryParam)
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category))
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew)
        break
      default:
        break
    }

    return filtered
  }, [categoryParam, selectedCategories, priceRange, sortBy])

  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
  }

  const currentCategory = categoryList.find(cat => cat.id === categoryParam)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCategory ? currentCategory.name : '全部商品'}
          </h1>
          <p className="text-gray-600">
            {currentCategory ? currentCategory.description : '发现我们精心挑选的生活用品'}
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
            
            <span className="text-sm text-gray-600">
              找到 {filteredProducts.length} 件商品
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认排序</SelectItem>
                <SelectItem value="price-low">价格从低到高</SelectItem>
                <SelectItem value="price-high">价格从高到低</SelectItem>
                <SelectItem value="rating">评分最高</SelectItem>
                <SelectItem value="newest">最新商品</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">筛选条件</h3>

                {/* Category Filter */}
                {!categoryParam && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">商品分类</h4>
                    <div className="space-y-2">
                      {categoryList.map((category) => (   // 这里改为 categoryList
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                          />
                          <label htmlFor={category.id} className="text-sm">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">价格区间</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>¥{priceRange[0]}</span>
                      <span>¥{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([])
                    setPriceRange([0, 500])
                    setSortBy('default')
                  }}
                >
                  清除筛选
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">没有找到符合条件的商品</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategories([])
                    setPriceRange([0, 500])
                    setSortBy('default')
                  }}
                >
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage

