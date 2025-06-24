import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus } from 'lucide-react'
import API_BASE_URL from '../config/api'

const AddAddressModal = ({ userId, onAddressAdded }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '中国',
    province: '',
    city: '',
    district: '',
    address_line: '',
    postal_code: '',
    is_default: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId
        })
      })

      if (response.ok) {
        const newAddress = await response.json()
        onAddressAdded(newAddress)
        setOpen(false)
        setFormData({
          name: '',
          phone: '',
          country: '中国',
          province: '',
          city: '',
          district: '',
          address_line: '',
          postal_code: '',
          is_default: false
        })
      } else {
        const error = await response.json()
        alert(error.error || '添加地址失败')
      }
    } catch (error) {
      console.error('Error adding address:', error)
      alert('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加新地址
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>添加收货地址</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">收货人姓名 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="请输入收货人姓名"
              />
            </div>
            <div>
              <Label htmlFor="phone">手机号码 *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="请输入手机号码"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="province">省份 *</Label>
              <Input
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                placeholder="省份"
              />
            </div>
            <div>
              <Label htmlFor="city">城市 *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="城市"
              />
            </div>
            <div>
              <Label htmlFor="district">区县</Label>
              <Input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="区县"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address_line">详细地址 *</Label>
            <Input
              id="address_line"
              name="address_line"
              value={formData.address_line}
              onChange={handleChange}
              required
              placeholder="请输入详细地址"
            />
          </div>

          <div>
            <Label htmlFor="postal_code">邮政编码</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="邮政编码"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
            />
            <Label htmlFor="is_default">设为默认地址</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存地址'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAddressModal

