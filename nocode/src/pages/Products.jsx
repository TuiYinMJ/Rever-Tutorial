import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  Filter,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '件',
    price: '',
    currency: 'USD',
    image_url: ''
  });

  // 获取产品数据
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理文件上传
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // 上传到Supabase Storage
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 使用已创建的 shoppingpic 存储桶
      const { error: uploadError } = await supabase.storage
        .from('shoppingpic')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('shoppingpic')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast.success('图片上传成功');
    } catch (error) {
      toast.error('图片上传失败: ' + error.message);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '件',
      price: '',
      currency: 'USD',
      image_url: ''
    });
    setEditingProduct(null);
    setImagePreview(null);
  };

  // 打开编辑对话框
  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      unit: product.unit || '件',
      price: product.price || '',
      currency: product.currency || 'USD',
      image_url: product.image_url || ''
    });
    setImagePreview(product.image_url || null);
    setIsDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // 提交表单（新增或更新产品）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 基本验证
      if (!formData.name.trim()) {
        toast.error('产品名称不能为空');
        return;
      }
      
      if (editingProduct) {
        // 更新产品
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            price: parseFloat(formData.price) || 0,
            updated_at: new Date()
          })
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast.success('产品更新成功');
      } else {
        // 新增产品
        const { error } = await supabase
          .from('products')
          .insert([{
            ...formData,
            price: parseFloat(formData.price) || 0,
            user_id: (await supabase.auth.getUser()).data.user.id
          }]);
        
        if (error) throw error;
        toast.success('产品创建成功');
      }
      
      // 刷新数据
      queryClient.invalidateQueries(['products']);
      closeDialog();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 删除产品
  const handleDeleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('产品删除成功');
      queryClient.invalidateQueries(['products']);
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    }
  };

  // 过滤产品数据
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // 获取产品分类列表
  const categories = [...new Set(products?.map(p => p.category).filter(Boolean) || [])];

  // 移动端产品卡片组件
  const ProductCard = ({ product }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-4">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {product.category ? (
              <Badge variant="secondary">{product.category}</Badge>
            ) : (
              '-'
            )}
          </p>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">单价:</span>
          <span className="font-medium">
            {product.currency} {parseFloat(product.price || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">单位:</span>
          <span>{product.unit}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={() => openEditDialog(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="ml-2 text-red-600"
          onClick={() => handleDeleteProduct(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">产品管理</h1>
          <p className="text-gray-500">管理您的产品信息和价格</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              新增产品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? '编辑产品' : '新增产品'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">产品名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入产品名称"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">产品描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="请输入产品描述"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">产品分类</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="请输入分类"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">单位</Label>
                  <Select value={formData.unit} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, unit: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="件">件</SelectItem>
                      <SelectItem value="套">套</SelectItem>
                      <SelectItem value="米">米</SelectItem>
                      <SelectItem value="千克">千克</SelectItem>
                      <SelectItem value="台">台</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">单价 *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="请输入单价"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">货币</Label>
                  <Select value={formData.currency} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, currency: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">产品图片</Label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="预览" 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image').click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      上传图片
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit">
                  {editingProduct ? '更新' : '创建'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索产品名称、描述..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="产品分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                更多筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 产品列表 - 响应式设计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            产品列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* 桌面端表格视图 */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品图片</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead>单位</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts && filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          {product.category ? (
                            <Badge variant="secondary">{product.category}</Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {product.currency} {parseFloat(product.price || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑产品
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除产品
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* 当没有产品数据时显示提示信息 */}
                    {filteredProducts && filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          暂无产品数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* 移动端卡片视图 */}
              <div className="md:hidden">
                {filteredProducts && filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {filteredProducts && filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无产品数据
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
