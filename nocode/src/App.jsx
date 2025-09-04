import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
      setIsChecking(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return children;
};

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // 监听自定义事件关闭侧边栏
  useEffect(() => {
    const closeSidebarHandler = () => setSidebarOpen(false);
    window.addEventListener('close-sidebar', closeSidebarHandler);
    return () => window.removeEventListener('close-sidebar', closeSidebarHandler);
  }, []);

  // 点击侧边栏外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <div className="flex">
            {/* 移动端汉堡菜单按钮 */}
            <div className="md:hidden fixed top-4 left-4 z-20">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            {/* 侧边栏 - 在移动端默认隐藏 */}
            <div 
              ref={sidebarRef}
              className={`fixed md:relative z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:block`}
            >
              <Sidebar />
            </div>
            
            {/* 遮罩层 - 移动端侧边栏打开时显示 */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* 主内容区域 */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64'}`}>
              <div className="pt-16 md:pt-0">
                <Routes>
                  {navItems.map(({ to, page, protected: isProtected }) => (
                    <Route 
                      key={to} 
                      path={to} 
                      element={
                        isProtected ? (
                          <ProtectedRoute>
                            <div className="p-4 md:p-6">
                              {page}
                            </div>
                          </ProtectedRoute>
                        ) : (
                          <div className="p-4 md:p-6">
                            {page}
                          </div>
                        )
                      } 
                    />
                  ))}
                </Routes>
              </div>
            </main>
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <AppContent />;
};

export default App;
