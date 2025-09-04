import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '@/nav-items';
import { cn } from '@/lib/utils';
import { 
  HomeIcon, 
  BarChart3, 
  Users, 
  Mail, 
  FileText,
  Globe,
  DollarSign,
  User,
  Settings,
  LogOut,
  Key,
  Handshake,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import GlobalInfo from '@/components/GlobalInfo';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 获取当前用户信息
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  // 过滤出需要在侧边栏显示的导航项（排除登录、注册等页面和底部导航项）
  const sidebarItems = navItems.filter(item => 
    !['/login', '/register', '/forgot-password', '/profile', '/change-password'].includes(item.to)
  );

  // 用户登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="flex flex-col h-full">
        {/* Logo 区域 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">外贸业务助手</h1>
          {/* 移动端关闭按钮 */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => {
              // 通过DOM操作关闭侧边栏（在App.jsx中处理）
              const closeEvent = new CustomEvent('close-sidebar');
              window.dispatchEvent(closeEvent);
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      // 移动端点击导航项后关闭侧边栏
                      const closeEvent = new CustomEvent('close-sidebar');
                      window.dispatchEvent(closeEvent);
                    }}
                  >
                    <span className="mr-3">
                      {item.icon || (
                        item.title === "首页" ? <HomeIcon className="h-5 w-5" /> :
                        item.title === "仪表盘" ? <BarChart3 className="h-5 w-5" /> :
                        item.title === "客户管理" ? <Users className="h-5 w-5" /> :
                        item.title === "询盘管理" ? <Mail className="h-5 w-5" /> :
                        item.title === "公海" ? <Handshake className="h-5 w-5" /> :
                        <FileText className="h-5 w-5" />
                      )}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* 全球信息区域 */}
        <div className="p-4 border-t border-gray-200">
          <GlobalInfo />
        </div>
        
        {/* 用户信息区域 */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full p-2 h-auto justify-start"
                onClick={() => setIsUserMenuOpen(true)}
              >
                <User className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium text-sm">
                    {user?.email ? user.email.split('@')[0] : '用户'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || '未知用户'}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email ? user.email.split('@')[0] : '用户'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || '未知用户'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                个人信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/change-password')}>
                <Key className="mr-2 h-4 w-4" />
                修改密码
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
