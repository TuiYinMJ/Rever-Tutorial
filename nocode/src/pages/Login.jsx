import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error('登录失败: ' + error.message);
        return;
      }
      
      toast.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      toast.error('登录失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (error) {
        // 提供更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Email not confirmed')) {
          errorMessage = '请先验证您的邮箱地址';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = '邮箱地址格式不正确';
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = '邮件发送过于频繁，请稍后再试';
        }
        
        toast.error('发送验证码失败: ' + errorMessage);
        return;
      }
      
      setOtpSent(true);
      toast.success('验证码已发送到您的邮箱，请查收');
    } catch (error) {
      toast.error('发送验证码失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'magiclink'
      });
      
      if (error) {
        toast.error('登录失败: ' + error.message);
        return;
      }
      
      toast.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      toast.error('登录失败: ' + error.message);
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
            请登录您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 登录方式切换 */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={loginMethod === 'password' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setLoginMethod('password')}
            >
              密码登录
            </Button>
            <Button
              variant={loginMethod === 'otp' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setLoginMethod('otp')}
            >
              验证码登录
            </Button>
          </div>

          {loginMethod === 'password' ? (
            /* 密码登录表单 */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          ) : (
            /* 验证码登录表单 */
            <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-email">邮箱</Label>
                <Input
                  id="otp-email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={otpSent}
                />
              </div>
              
              {otpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="otp">验证码</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="请输入验证码"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">验证码已发送到您的邮箱，请查收</p>
                </div>
              ) : null}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (otpSent ? '登录中...' : '发送中...') : (otpSent ? '登录' : '发送验证码')}
              </Button>
              
              {otpSent && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  重新发送验证码
                </Button>
              )}
            </form>
          )}
          
          <div className="mt-4 text-center space-y-2">
            <Button variant="link" onClick={() => navigate('/forgot-password')}>
              忘记密码？
            </Button>
            <div>
              <Button variant="link" asChild>
                <Link to="/register">
                  还没有账户？立即注册
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
