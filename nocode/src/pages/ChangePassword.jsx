import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Key, ArrowLeft, Shield } from 'lucide-react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // 验证新密码
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    
    // 简单密码强度检查
    if (newPassword.length < 6) {
      toast.error('新密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    
    try {
      // 首先验证当前密码
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('用户未登录');
      }

      // 使用当前密码重新登录验证
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error('当前密码不正确');
      }

      // 更新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        // 提供更详细的错误信息
        let errorMessage = updateError.message;
        if (updateError.message.includes('Password should be at least')) {
          errorMessage = '新密码长度至少为6位';
        } else if (updateError.message.includes('New password should be different')) {
          errorMessage = '新密码不能与当前密码相同';
        }
        
        throw new Error(errorMessage);
      }
      
      toast.success('密码修改成功');
      
      // 清空表单
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // 可选：跳转到个人信息页面
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error) {
      toast.error('修改失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/profile')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回个人信息
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">修改密码</h1>
        <p className="text-gray-500">为了账户安全，请定期更新您的密码</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              修改密码
            </CardTitle>
            <CardDescription>
              请输入当前密码和新密码
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">当前密码</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="请输入当前密码"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="请输入新密码"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">密码长度至少6位</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '修改中...' : '修改密码'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 安全提示 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Shield className="mr-2 h-4 w-4" />
              安全提示
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• 密码长度至少6位字符</p>
            <p>• 建议使用字母、数字和特殊字符的组合</p>
            <p>• 不要使用容易被猜到的密码</p>
            <p>• 定期更换密码以保障账户安全</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
