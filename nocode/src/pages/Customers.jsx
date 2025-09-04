import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import { DialogContent, DialogTitle, Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SelectItem, Select, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Eye, Trash2, Filter, Search, MoreHorizontal, Edit, Users, Plus, Send } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenu, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 表单状态
  const [formData, setFormData] = useState({
    company_name: '',
    country: '',
    level: 'C',
    status: '潜在',
    contact_person: '',
    last_contact: '',
    owner: ''
  });

  // 获取客户数据
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user.id;

      // 查询当前用户的所有客户
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId) // 只获取当前用户的客户
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case '成交': return <Badge className="bg-green-500">成交</Badge>;
      case '报价中': return <Badge className="bg-blue-500">报价中</Badge>;
      case '潜在': return <Badge className="bg-yellow-500">潜在</Badge>;
      case '新询盘': return <Badge className="bg-purple-500">新询盘</Badge>;
      case '流失': return <Badge className="bg-red-500">流失</Badge>;
      default: return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'A': return <Badge className="bg-red-500">A级</Badge>;
      case 'B': return <Badge className="bg-orange-500">B级</Badge>;
      case 'C': return <Badge className="bg-yellow-500">C级</Badge>;
      default: return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理等级选择变化
  const handleLevelChange = (value) => {
    setFormData(prev => ({
      ...prev,
      level: value
    }));
  };

  // 处理状态选择变化
  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      company_name: '',
      country: '',
      level: 'C',
      status: '潜在',
      contact_person: '',
      last_contact: '',
      owner: ''
    });
    setEditingCustomer(null);
  };

  // 打开编辑对话框
  const openEditDialog = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      company_name: customer.company_name || '',
      country: customer.country || '',
      level: customer.level || 'C',
      status: customer.status || '潜在',
      contact_person: customer.contact_person || '',
      last_contact: customer.last_contact || '',
      owner: customer.owner || ''
    });
    setIsDialogOpen(true);
  };

  // 打开查看对话框
  const openViewDialog = (customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // 关闭查看对话框
  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingCustomer(null);
  };

  // 提交表单（新增或更新客户）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 基本验证
      if (!formData.company_name.trim()) {
        toast.error('公司名称不能为空');
        return;
      }
      
      if (editingCustomer) {
        // 更新客户
        const { error } = await supabase
          .from('customers')
          .update({
            ...formData,
            updated_at: new Date()
          })
          .eq('id', editingCustomer.id);
        
        if (error) throw error;
        toast.success('客户更新成功');
      } else {
        // 新增客户
        const { error } = await supabase
          .from('customers')
          .insert([{
            ...formData,
            user_id: (await supabase.auth.getUser()).data.user.id
          }]);
        
        if (error) throw error;
        toast.success('客户创建成功');
      }
      
      // 刷新数据
      queryClient.invalidateQueries(['customers']);
      closeDialog();
    } catch (error) {
      toast.error('操作失败: ' + error.message);
    }
  };

  // 删除客户
  const handleDeleteCustomer = async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('客户删除成功');
      queryClient.invalidateQueries(['customers']);
    } catch (error) {
      toast.error('删除失败: ' + error.message);
    }
  };

  // 移交到公海（将负责人设为空）
  const handleTransferToPool = async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ owner: null, updated_at: new Date() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('客户已移交到公海');
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['public-customers']);
    } catch (error) {
      toast.error('移交失败: ' + error.message);
    }
  };

  // 过滤客户数据
  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 移动端客户卡片组件
  const CustomerCard = ({ customer }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{customer.company_name}</h3>
          <p className="text-sm text-gray-500">{customer.country || '-'}</p>
        </div>
        <Badge variant={customer.level === 'A' ? 'destructive' : customer.level === 'B' ? 'default' : 'secondary'}>
          {customer.level}级
        </Badge>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">状态:</span>
          <span>{getStatusBadge(customer.status)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">联系人:</span>
          <span>{customer.contact_person || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">最后跟进:</span>
          <span>
            {customer.last_contact 
              ? new Date(customer.last_contact).toLocaleDateString('zh-CN') 
              : '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">负责人:</span>
          <span>{customer.owner || '未分配'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button size="sm" variant="outline" onClick={() => openViewDialog(customer)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={() => openEditDialog(customer)}>
          <Edit className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleTransferToPool(customer.id)}>
              <Send className="mr-2 h-4 w-4" />
              移交公海
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">客户管理</h1>
          <p className="text-gray-500">管理您的客户信息和跟进记录</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              新增客户
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? '编辑客户' : '新增客户'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">公司名称 *</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="请输入公司名称"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">国家/地区</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="请输入国家/地区"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">客户等级</Label>
                <Select value={formData.level} onValueChange={handleLevelChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A级</SelectItem>
                    <SelectItem value="B">B级</SelectItem>
                    <SelectItem value="C">C级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">客户状态</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="新询盘">新询盘</SelectItem>
                    <SelectItem value="报价中">报价中</SelectItem>
                    <SelectItem value="潜在">潜在</SelectItem>
                    <SelectItem value="成交">成交</SelectItem>
                    <SelectItem value="流失">流失</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_person">主要联系人</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="请输入主要联系人"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_contact">最后跟进</Label>
                <Input
                  id="last_contact"
                  name="last_contact"
                  type="date"
                  value={formData.last_contact}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">负责人</Label>
                <Input
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  placeholder="请输入负责人"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  取消
                </Button>
                <Button type="submit">
                  {editingCustomer ? '更新' : '创建'}
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
                placeholder="搜索客户公司、联系人..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="客户状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="新询盘">新询盘</SelectItem>
                  <SelectItem value="报价中">报价中</SelectItem>
                  <SelectItem value="潜在">潜在</SelectItem>
                  <SelectItem value="成交">成交</SelectItem>
                  <SelectItem value="流失">流失</SelectItem>
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

      {/* 客户列表 - 响应式设计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            客户列表
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
                      <TableHead>公司名称</TableHead>
                      <TableHead>国家/地区</TableHead>
                      <TableHead>客户等级</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>主要联系人</TableHead>
                      <TableHead>最后跟进</TableHead>
                      <TableHead>负责人</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers && filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.company_name}</TableCell>
                        <TableCell>{customer.country || '-'}</TableCell>
                        <TableCell>{getLevelBadge(customer.level)}</TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{customer.contact_person || '-'}</TableCell>
                        <TableCell>
                          {customer.last_contact 
                            ? new Date(customer.last_contact).toLocaleDateString('zh-CN') 
                            : '-'}
                        </TableCell>
                        <TableCell>{customer.owner || '未分配'}</TableCell>
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
                              <DropdownMenuItem onClick={() => openViewDialog(customer)}>
                                <Eye className="mr-2 h-4 w-4" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑客户
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleTransferToPool(customer.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                移交公海
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除客户
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* 当没有客户数据时显示提示信息 */}
                    {filteredCustomers && filteredCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          暂无客户数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* 移动端卡片视图 */}
              <div className="md:hidden">
                {filteredCustomers && filteredCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
                {filteredCustomers && filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无客户数据
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 查看客户详情对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
        setIsViewDialogOpen(open);
        if (!open) closeViewDialog();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>客户详情</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">公司名称</Label>
                  <div className="font-medium">{viewingCustomer.company_name}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">国家/地区</Label>
                  <div>{viewingCustomer.country || '-'}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">客户等级</Label>
                  <div>{getLevelBadge(viewingCustomer.level)}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">客户状态</Label>
                  <div>{getStatusBadge(viewingCustomer.status)}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">主要联系人</Label>
                  <div>{viewingCustomer.contact_person || '-'}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">最后跟进</Label>
                  <div>
                    {viewingCustomer.last_contact 
                      ? new Date(viewingCustomer.last_contact).toLocaleDateString('zh-CN') 
                      : '-'}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-500">负责人</Label>
                  <div>{viewingCustomer.owner || '未分配'}</div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={closeViewDialog}>
                  关闭
                </Button>
                <Button onClick={() => {
                  closeViewDialog();
                  openEditDialog(viewingCustomer);
                }}>
                  编辑
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
