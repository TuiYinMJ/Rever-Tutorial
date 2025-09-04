import React, { useState } from 'react';
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
  Filter,
  Handshake,
  UserPlus
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PublicPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  // 获取公海客户数据（没有负责人的客户）
  const { data: publicCustomers, isLoading } = useQuery({
    queryKey: ['public-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .is('owner', null) // 只获取没有负责人的客户
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

  // 认领客户
  const handleClaimCustomer = async (id) => {
    try {
      // 获取当前用户信息
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('customers')
        .update({ 
          owner: user.email.split('@')[0], // 使用邮箱前缀作为负责人
          updated_at: new Date() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('客户认领成功');
      queryClient.invalidateQueries(['public-customers']);
      queryClient.invalidateQueries(['customers']);
    } catch (error) {
      toast.error('认领失败: ' + error.message);
    }
  };

  // 过滤客户数据
  const filteredCustomers = publicCustomers?.filter(customer => {
    const matchesSearch = 
      customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 移动端公海客户卡片组件
  const PublicCustomerCard = ({ customer }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{customer.company_name}</h3>
          <p className="text-sm text-gray-500">{customer.country || '-'}</p>
        </div>
        {getLevelBadge(customer.level)}
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
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={() => handleClaimCustomer(customer.id)}>
          <UserPlus className="mr-2 h-4 w-4" />
          认领
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">客户公海</h1>
        <p className="text-gray-500">认领无负责人的客户</p>
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

      {/* 公海客户列表 - 响应式设计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Handshake className="mr-2 h-5 w-5" />
            公海客户列表
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
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={() => handleClaimCustomer(customer.id)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            认领
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* 当没有客户数据时显示提示信息 */}
                    {filteredCustomers && filteredCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          暂无公海客户数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* 移动端卡片视图 */}
              <div className="md:hidden">
                {filteredCustomers && filteredCustomers.map((customer) => (
                  <PublicCustomerCard key={customer.id} customer={customer} />
                ))}
                {filteredCustomers && filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无公海客户数据
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

export default PublicPool;
