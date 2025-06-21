import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    // 从localStorage加载最近搜索
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      // 保存到最近搜索
      const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
      
      onSearch(term)
      onClose()
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* 搜索框 */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="搜索商品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 text-lg"
                autoFocus
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={!searchTerm.trim()}>
              搜索
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 最近搜索 */}
        {recentSearches.length > 0 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">最近搜索</h3>
              <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                清除
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 热门搜索建议 */}
        <div className="p-6 pt-0">
          <h3 className="text-sm font-medium text-gray-900 mb-4">热门搜索</h3>
          <div className="flex flex-wrap gap-2">
            {['厨房用品', '家居装饰', '个人护理', '收纳整理', '清洁用品'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal

