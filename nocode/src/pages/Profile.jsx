import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    company: '',
    position: ''
  });

  // 获取用户信息
  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      // 获取用户详细信息
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // 合并用户基本信息和详细信息
      const userData = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        company: profile?.company || '',
        position: profile?.position || ''
      };

      // 设置表单数据
      setFormData({
        email: userData.email || '',
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        company: userData.company || '',
        position: userData.position || ''
      });

      return userData;
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

  // 保存用户信息
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          updated_at: new Date()
        });

      if (error) throw error;

      toast.success('个人信息更新成功');
      setIsEditing(false);
      queryClient.invalidateQueries(['user-profile']);
    } catch (error) {
      toast.error('更新失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    // 重置表单数据
    setFormData({
      email: user?.email || '',
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      company: user?.company || '',
      position: user?.position || ''
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">个人信息</h1>
        <p className="text-gray-500">管理您的账户信息和个人资料</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息卡片 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                基本信息
              </CardTitle>
              <CardDescription>
                更新您的个人基本信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500">邮箱地址无法修改</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name">姓名</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="请输入您的姓名"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="请输入联系电话"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">公司名称</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="请输入公司名称"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="position">职位</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="请输入您的职位"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        取消
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? '保存中...' : '保存'}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      编辑信息
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 账户信息卡片 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                账户信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">邮箱地址</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">注册时间</p>
                  <p className="text-sm text-gray-500">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('zh-CN')
                      : '-'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">用户ID</p>
                  <p className="text-sm text-gray-500 font-mono">
                    {user?.id ? user.id.substring(0, 8) + '...' : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.hash = '/change-password'}
              >
                修改密码
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.hash = '/dashboard'}
              >
                返回仪表盘
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
