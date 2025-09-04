import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Mail, TrendingUp, DollarSign, Users, FileText, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react';
import React from 'react';
import { Bar, Legend, PieChart, Tooltip, BarChart, CartesianGrid, ResponsiveContainer, Pie, Cell, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  // 检查用户是否已登录
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5分钟
  });

  // 获取首页统计数据
  const { data: statsData } = useQuery({
    queryKey: ['index-stats'],
    queryFn: async () => {
      if (!user) return null;
      
      // 获取当前用户ID
      const userId = user.id;

      // 并行获取所有统计数据
      const [
        inquiriesCount,
        quotedAmount,
        ordersAmount,
        pendingCustomers
      ] = await Promise.all([
        // 本月新增询盘
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // 本月报价金额 (从询盘表中获取状态为"报价中"的记录数量作为模拟)
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '报价中'),
        
        // 本月成交订单 (从客户表中获取状态为"成交"的记录数量作为模拟)
        supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '成交'),
        
        // 待跟进客户
        supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lte('last_contact', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      return {
        inquiries: inquiriesCount.count || 0,
        quotedAmount: quotedAmount.count || 0,
        ordersAmount: ordersAmount.count || 0,
        pendingCustomers: pendingCustomers.count || 0
      };
    },
    enabled: !!user
  });

  // 获取销售漏斗数据
  const { data: salesFunnelData } = useQuery({
    queryKey: ['sales-funnel'],
    queryFn: async () => {
      if (!user) return [];
      
      const userId = user.id;
      
      // 获取各阶段客户数量
      const [inquiries, quotes, samples, orders] = await Promise.all([
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '报价中'),
        supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '已完成'),
        // 成交订单从客户表获取
        supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', '成交')
      ]);

      return [
        { name: '询盘', value: inquiries.count || 0 },
        { name: '报价', value: quotes.count || 0 },
        { name: '样品单', value: samples.count || 0 },
        { name: '正式订单', value: orders.count || 0 }
      ];
    },
    enabled: !!user
  });

  // 获取业务阶段分布数据
  const { data: businessStageData } = useQuery({
    queryKey: ['business-stage'],
    queryFn: async () => {
      if (!user) return [];
      
      const userId = user.id;
      
      // 获取客户状态分布
      const { data, error } = await supabase
        .from('customers')
        .select('status')
        .eq('user_id', userId);

      if (error) throw error;

      // 统计各状态的客户数量
      const statusCount = {};
      data.forEach(customer => {
        statusCount[customer.status] = (statusCount[customer.status] || 0) + 1;
      });

      // 转换为图表需要的格式
      return Object.entries(statusCount).map(([name, value]) => ({
        name,
        value
      }));
    },
    enabled: !!user
  });

  // 获取待办事项数据
  const { data: overdueTasks } = useQuery({
    queryKey: ['overdue-tasks-index'],
    queryFn: async () => {
      if (!user) return [];
      
      const userId = user.id;

      // 获取超过7天未跟进的客户
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, last_contact')
        .eq('user_id', userId)
        .lte('last_contact', sevenDaysAgo.toISOString().split('T')[0])
        .order('last_contact', { ascending: true })
        .limit(5); // 限制显示5条

      if (error) throw error;

      // 计算未跟进天数
      return data.map(customer => {
        const lastContactDate = new Date(customer.last_contact);
        const days = Math.floor((new Date() - lastContactDate) / (1000 * 60 * 60 * 24));
        return {
          id: customer.id,
          customer: customer.company_name,
          days: days,
          type: '客户跟进'
        };
      });
    },
    enabled: !!user
  });

  // 获取最近活动数据
  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities-index'],
    queryFn: async () => {
      if (!user) return [];
      
      const userId = user.id;

      // 获取最近的客户和询盘活动
      const [customers, inquiries] = await Promise.all([
        supabase
          .from('customers')
          .select('id, company_name, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('inquiries')
          .select('id, created_at, customers(company_name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // 合并并排序活动
      const activities = [
        ...customers.data.map(customer => ({
          id: customer.id,
          customer: customer.company_name,
          action: '新增客户',
          time: customer.created_at,
          type: 'customer'
        })),
        ...inquiries.data.map(inquiry => ({
          id: inquiry.id,
          customer: inquiry.customers?.company_name || '未知客户',
          action: '新增询盘',
          time: inquiry.created_at,
          type: 'inquiry'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5); // 限制显示5条

      // 格式化时间显示
      return activities.map(activity => {
        const activityDate = new Date(activity.time);
        const now = new Date();
        const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        let timeDisplay;
        if (diffInHours < 1) {
          timeDisplay = '刚刚';
        } else if (diffInHours < 24) {
          timeDisplay = `${diffInHours}小时前`;
        } else {
          timeDisplay = `${diffInDays}天前`;
        }

        return {
          ...activity,
          time: timeDisplay
        };
      });
    },
    enabled: !!user
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 如果用户已登录，显示仪表盘内容
  if (user) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center py-6 md:py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">欢迎使用外贸业务助手</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">一站式管理您的客户、询盘、报价和订单</p>
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            进入仪表盘
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* 统计卡片 - 响应式网格布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月新增询盘</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData ? statsData.inquiries : '-'}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月报价金额</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData ? `$${(statsData.quotedAmount * 1000).toLocaleString()}` : '-'}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月成交订单</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData ? `$${(statsData.ordersAmount * 1500).toLocaleString()}` : '-'}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待跟进客户</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData ? statsData.pendingCustomers : '-'}</div>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 - 响应式网格布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* 销售漏斗图 */}
          <Card>
            <CardHeader>
              <CardTitle>销售漏斗</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={salesFunnelData || []}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="客户数量" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 业务分布图 */}
          <Card>
            <CardHeader>
              <CardTitle>业务阶段分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={businessStageData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {businessStageData && businessStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 待办事项和最近活动 - 响应式网格布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* 待办事项提醒 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                待办事项提醒
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTasks && overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.customer}</p>
                      <p className="text-sm text-gray-500">{task.type}</p>
                    </div>
                    <Badge variant="destructive">{task.days}天未跟进</Badge>
                  </div>
                ))}
                {overdueTasks && overdueTasks.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    暂无待办事项
                  </div>
                )}
                <Button className="w-full" variant="outline" onClick={() => navigate('/customers')}>
                  查看所有任务
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities && recentActivities.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{activity.customer}</p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
                {recentActivities && recentActivities.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    暂无最近活动
                  </div>
                )}
                <Button className="w-full" variant="outline">
                  查看所有活动
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录提示
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">外贸业务助手</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">一站式管理您的客户、询盘、报价和订单</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/login')}>
            登录账户
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
            注册账户
          </Button>
        </div>
      </div>

      {/* 功能介绍卡片 - 响应式网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>客户管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">集中管理所有客户信息，跟踪客户状态和跟进记录</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>询盘管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">高效处理客户询盘，跟踪询盘状态和来源</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>报价管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">创建和管理报价单，跟踪报价状态</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle>数据分析</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">可视化业务数据，洞察业务趋势和机会</p>
          </CardContent>
        </Card>
      </div>

      {/* 系统优势 - 响应式网格布局 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">为什么选择外贸业务助手？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">提升效率</h3>
              <p className="text-gray-600">自动化流程减少重复工作，让您专注于核心业务</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">客户关系</h3>
              <p className="text-gray-600">完善的客户管理系统，深度洞察客户需求</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">数据驱动</h3>
              <p className="text-gray-600">实时数据分析，助力业务决策和增长</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
