import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    // 简单密码强度检查
    if (password.length < 6) {
      toast.error('密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    
    try {
      // 使用邮箱和密码注册
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        // 提供更详细的错误信息
        let errorMessage = error.message;
        if (error.message.includes('Unable to validate email address')) {
          errorMessage = '邮箱地址格式不正确';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = '密码长度至少为6位';
        } else if (error.message.includes('User already registered')) {
          errorMessage = '该邮箱已被注册，请直接登录';
        }
        
        throw new Error(errorMessage);
      }
      
      // 切换到验证步骤
      setStep('verify');
      toast.success('注册信息已提交，请查收邮箱中的验证码');
    } catch (error) {
      toast.error('注册失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 验证邮箱验证码
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
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
      
      toast.success('邮箱验证成功，欢迎使用外贸业务助手！');
      navigate('/dashboard');
    } catch (error) {
      toast.error('验证失败: ' + error.message);
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
            {step === 'register' ? '创建您的账户' : '验证您的邮箱'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
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
                <p className="text-sm text-gray-500">我们将向此邮箱发送验证邮件</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">密码长度至少6位</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '注册中...' : '注册'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
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
                <Label htmlFor="otp">验证码</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="请输入邮箱中的验证码"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '验证中...' : '验证邮箱'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setStep('register')}
                disabled={loading}
              >
                重新注册
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full" 
                onClick={handleRegister}
                disabled={loading}
              >
                重新发送验证码
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link to="/login">
                已有账户？立即登录
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
