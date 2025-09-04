import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
  Mail, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const queryClient = useQueryClient();

  // 表单状态
  const [formData, setFormData] = useState({
    customer_id: '',
    products_inquired: '',
    status: '待处理',
    source: ''
  });

  // 获取当前用户的所有询盘
  const { data: inquiries, isLoading: isLoadingInquiries } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*, customers(company_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // 获取当前用户的所有客户（用于下拉选择）
  const { data: customers } = useQuery({
    queryKey: ['customers-for-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name')
        .order('company_name');
      
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

  // 处理状态选择变化
  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  // 处理来源选择变化
  const handleSourceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      source: value
    }));
  };

  // 处理客户选择变化
  const handleCustomerChange = (value) => {
    setFormData(prev => ({
      ...prev,
      customer_id: value
    }));
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      customer_id: '',
      products_inquired: '',
      status: '待处理',
      source: ''
    });
    setEditingInquiry(null);
  };

  // 打开编辑对话框
  const openEditDialog = (inquiry) => {
    setEditingInquiry(inquiry);
    setFormData({
      customer_id: inquiry.customer_id || '',
      products_inquired: inquiry.products_inquired || '',
      status: inquiry.status || '待处理',
      source: inquiry.source || ''
    });
    setIsDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // 提交表单（新增或更新）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 基本验证
      if (!formData.customer_id) {
        toast.error('请选择关联客户');
        return;
      }
      
      if (editingInquiry) {
        // 更新询盘
        const { error } = await supabase
          .from('inquiries')
          .update({
            ...formData,
            updated_at: new Date()
          })
          .eq('id', editingInquiry.id);
        
        if (error) throw error;
        toast.success('询盘更新成功');
      } else {
        // 新增询盘
        const { error } = await supabase
          .from('inquiries')
          .insert([{
            ...formData,
            user_id: (await supabase.auth.getUser()).data.user.id
          }]);
        
        if (error) throw error;
        toast.success('询盘创建成功');
      }
      
      // 刷新数据
      queryClient.invalidateQueries(['inquiries']);
      closeDialog();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 删除询盘
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('询盘删除成功');
      queryClient.invalidateQueries(['inquiries']);
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case '待处理': return <Badge className="bg-yellow-500">待处理</Badge>;
      case '报价中': return <Badge className="bg-blue-500">报价中</Badge>;
      case '已完成': return <Badge className="bg-green-500">已完成</Badge>;
      case '已关闭': return <Badge className="bg-gray-500">已关闭</Badge>;
      default: return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  // 过滤询盘数据
  const filteredInquiries = inquiries?.filter(inquiry => {
    const matchesSearch = 
      inquiry.customers?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.source && inquiry.source.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 移动端询盘卡片组件
  const InquiryCard = ({ inquiry }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{inquiry.customers?.company_name || '未关联客户'}</h3>
          <p className="text-sm text-gray-500">
            {new Date(inquiry.created_at).toLocaleDateString('zh-CN')}
          </p>
        </div>
        {getStatusBadge(inquiry.status)}
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">产品:</span>
          <span className="text-right">{inquiry.products_inquired || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">来源:</span>
          <span>{inquiry.source || '-'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button size="sm" onClick={() => openEditDialog(inquiry)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-red-600"
          onClick={() => handleDelete(inquiry.id)}
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
          <h1 className="text-3xl font-bold">询盘管理</h1>
          <p className="text-gray-500">管理客户询盘和跟进状态</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              新增询盘
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingInquiry ? '编辑询盘' : '新增询盘'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_id">关联客户 *</Label>
                <Select value={formData.customer_id || ''} onValueChange={handleCustomerChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="products_inquired">询盘产品</Label>
                <Textarea
                  id="products_inquired"
                  name="products_inquired"
                  value={formData.products_inquired}
                  onChange={handleInputChange}
                  placeholder="请输入询盘产品信息"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">询盘状态</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="待处理">待处理</SelectItem>
                    <SelectItem value="报价中">报价中</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已关闭">已关闭</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">询盘来源</Label>
                <Select value={formData.source || ''} onValueChange={handleSourceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择来源" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="阿里巴巴">阿里巴巴</SelectItem>
                    <SelectItem value="官网">官网</SelectItem>
                    <SelectItem value="展会">展会</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="推荐">推荐</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit">
                  {editingInquiry ? '更新' : '创建'}
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
                placeholder="搜索客户、来源..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="询盘状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="待处理">待处理</SelectItem>
                  <SelectItem value="报价中">报价中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="已关闭">已关闭</SelectItem>
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

      {/* 询盘列表 - 响应式设计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            询盘列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingInquiries ? (
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
                      <TableHead>日期</TableHead>
                      <TableHead>客户</TableHead>
                      <TableHead>产品</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>来源</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries && filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          {new Date(inquiry.created_at).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell>
                          {inquiry.customers?.company_name || '未关联客户'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {inquiry.products_inquired || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell>{inquiry.source || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(inquiry)}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(inquiry.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* 移动端卡片视图 */}
              <div className="md:hidden">
                {filteredInquiries && filteredInquiries.map((inquiry) => (
                  <InquiryCard key={inquiry.id} inquiry={inquiry} />
                ))}
                {filteredInquiries && filteredInquiries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无询盘数据
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

export default Inquiries;
