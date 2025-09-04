import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        // 提供更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Unable to validate email address')) {
          errorMessage = '邮箱地址格式不正确';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '请先验证您的邮箱地址';
        }
        
        throw new Error(errorMessage);
      }
      
      setStep('verify');
      toast.success('密码重置邮件已发送，请查收');
    } catch (error) {
      toast.error('请求失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      });
      
      if (error) {
        // 提供更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Token has expired')) {
          errorMessage = '验证码已过期，请重新获取';
        } else if (error.message.includes('Invalid token')) {
          errorMessage = '验证码不正确，请检查后重新输入';
        }
        
        throw new Error(errorMessage);
      }
      
      setStep('reset');
      toast.success('验证成功，请设置新密码');
    } catch (error) {
      toast.error('验证失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    // 简单密码强度检查
    if (newPassword.length < 6) {
      toast.error('密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        // 提供更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Password should be at least')) {
          errorMessage = '密码长度至少为6位';
        }
        
        throw new Error(errorMessage);
      }
      
      toast.success('密码重置成功');
      navigate('/login');
    } catch (error) {
      toast.error('重置失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">外贸业务助手</CardTitle>
          <CardDescription className="text-center">
            {step === 'request' && '重置密码'}
            {step === 'verify' && '验证邮箱'}
            {step === 'reset' && '设置新密码'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">邮箱</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="请输入您的注册邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">我们将向此邮箱发送密码重置链接</p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '发送中...' : '发送重置链接'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                返回登录
              </Button>
            </form>
          )}
          
          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-email">注册邮箱</Label>
                <Input
                  id="verify-email"
                  type="email"
                  value={email}
                  disabled
                />
                <p className="text-sm text-gray-500">验证码已发送到您的邮箱，请查收</p>
                <p className="text-sm text-gray-500">如果没有收到邮件，请检查垃圾邮件文件夹</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verify-otp">验证码</Label>
                <Input
                  id="verify-otp"
                  type="text"
                  placeholder="请输入验证码"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '验证中...' : '验证'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleRequestReset}
                disabled={loading}
              >
                重新发送验证码
              </Button>
            </form>
          )}
          
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
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
                {loading ? '重置中...' : '重置密码'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
